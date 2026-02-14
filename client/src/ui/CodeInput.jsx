import React, { useState, useEffect } from 'react';
import { Labeled, useInput, useTheme, InputHelperText } from 'react-admin';
import { Box } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import FormHelperText from '@mui/material/FormHelperText';

export default ({ inputProps, ...props }) => {
  const {
    field: { value, onChange, onBlur },
    fieldState: { error }
  } = useInput(props);
  const [theme] = useTheme();
  const [state, setState] = useState();

  useEffect(() => {
    setState(value);
  }, [value]);

  return (
    <Labeled fullWidth>
      <Box
        sx={{ '& .cm-editor': { backgroundColor: 'inherit' } }}
        {...props}
        onBlur={(value) => {
          onChange(state);
          onBlur(value);
        }}
      >
        <CodeMirror
          value={value}
          {...inputProps}
          onChange={setState}
          extensions={[
            EditorView.lineWrapping,
            ...[theme === 'dark' ? [oneDark] : []],
            javascript({ jsx: true })
          ]}
        />
        <FormHelperText error={!!error}>
          <InputHelperText error={error?.message} />
        </FormHelperText>
      </Box>
    </Labeled>
  );
};
