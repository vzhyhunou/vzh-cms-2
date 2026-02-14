import React, { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { RichTextInput, DefaultEditorOptions } from 'ra-input-rich-text';
import { useTranslatableContext } from 'react-admin';
import get from 'lodash/get';

import ComponentExtension from './ComponentExtension';

const replaceTagName = (s, n1, n2) =>
  s.replace(new RegExp(`(/?)(${n1})([ >])`, 'g'), `$1${n2}$3`);

export default ({ source, ...rest }) => {
  const { setValue, getValues } = useFormContext();
  const { selectedLocale } = useTranslatableContext();
  const currentName = selectedLocale ? `${source}.${selectedLocale}` : source;
  const val = useWatch({ name: currentName }) || '<div></div>';
  const [state, setState] = useState();

  useEffect(() => {
    let value = val || '';
    value = replaceTagName(value, 'Component', 'react-component');
    value = (get(getValues(), `@files.${currentName}`) || []).reduce(
      (r, { src, title }) => r.replaceAll(title, src),
      value
    );
    setValue(`@editor.${currentName}`, value);
    setState(value);
  }, [currentName, getValues, setValue, val]);

  if (!state) {
    return null;
  }

  const handle = (val) => {
    let value = (get(getValues(), `@files.${currentName}`) || []).reduce(
      (r, { src, title }) => r.replaceAll(src, title),
      val
    );
    value = replaceTagName(value, 'react-component', 'Component');
    setValue(currentName, value);
  };

  return (
    <RichTextInput
      {...rest}
      source={`@editor.${source}`}
      defaultValue={state}
      editorOptions={{
        ...DefaultEditorOptions,
        onBlur: ({ editor }) => handle(editor.getHTML()),
        onFocus: ({ editor }) => handle(editor.getHTML()),
        extensions: [
          ...DefaultEditorOptions.extensions.map((e) =>
            e.name === 'image'
              ? {
                  ...e,
                  options: {
                    ...e.options,
                    allowBase64: true
                  }
                }
              : e
          ),
          ComponentExtension
        ]
      }}
    />
  );
};
