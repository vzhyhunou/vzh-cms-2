import React, { useCallback } from 'react';
import { ToggleButton } from '@mui/material';
import { useTranslate } from 'react-admin';
import { useTiptapEditor } from 'ra-input-rich-text';

export default ({ title, resource, name, children, ...rest }) => {
  const translate = useTranslate();
  const editor = useTiptapEditor();
  const handleClick = useCallback(() => {
    editor.chain().focus().insertComponent({ resource, name }).run();
  }, [editor, resource, name]);

  return (
    <ToggleButton
      title={translate(title)}
      {...rest}
      disabled={!editor?.isEditable}
      onClick={handleClick}
    >
      {children}
    </ToggleButton>
  );
};
