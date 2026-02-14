import React, { useCallback, useState } from 'react';
import {
  ToggleButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { useTranslate, ImageInput, ImageField } from 'react-admin';
import { useTiptapEditor } from 'ra-input-rich-text';

export default ({ title, children, ...rest }) => {
  const [open, setOpen] = useState(false);
  const translate = useTranslate();
  const editor = useTiptapEditor();
  const handleClick = useCallback(
    (url) => {
      editor.chain().focus().setImage({ src: url }).run();
      setOpen(false);
    },
    [editor]
  );

  return (
    <>
      <ToggleButton
        title={translate(title)}
        {...rest}
        disabled={!editor?.isEditable}
        onClick={() => setOpen(true)}
      >
        {children}
      </ToggleButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <ImageInput multiple accept={{ 'image/*': [] }} source="@files.body">
            <ImageField
              source="src"
              title="title"
              onClick={({ target: { src } }) => handleClick(src)}
            />
          </ImageInput>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            {translate('ra.action.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
