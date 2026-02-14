import React from 'react';
import { ImageField, ImageInput, useTranslatableContext } from 'react-admin';
import { useWatch, useFormContext } from 'react-hook-form';

export default ({ source, codeRef, ...rest }) => {
  const { setValue } = useFormContext();
  const { selectedLocale } = useTranslatableContext();
  const currentName = selectedLocale ? `${source}.${selectedLocale}` : source;
  const value = useWatch({ name: currentName }) || '';

  return (
    <ImageInput multiple accept={{ 'image/*': [] }} source={`@files.${source}`}>
      <ImageField
        {...rest}
        source="src"
        title="title"
        onClick={({ target: { title } }) => {
          const view = codeRef.current?.view;
          if (view) {
            const { from, to } = view.state.selection.main;
            setValue(
              currentName,
              value.slice(0, from) + `<img src="${title}"/>` + value.slice(to)
            );
          }
        }}
      />
    </ImageInput>
  );
};
