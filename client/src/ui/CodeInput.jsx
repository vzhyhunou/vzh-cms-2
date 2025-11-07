import React from 'react';
import { Labeled, useInput, useTheme, InputHelperText } from 'react-admin';
import { Box } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import FormHelperText from '@mui/material/FormHelperText';

export default (props) => {
  const {
    field: { value, onChange },
    fieldState: { error }
  } = useInput(props);
  const [theme] = useTheme();

  return (
    <Labeled fullWidth>
      <Box sx={{ '& .cm-editor': { backgroundColor: 'inherit' } }} {...props}>
        <CodeMirror
          value={value}
          onChange={onChange}
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
