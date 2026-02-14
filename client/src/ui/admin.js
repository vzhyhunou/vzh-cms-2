import * as admin from 'react-admin';
import * as editor from 'ra-input-rich-text';

const { Tab, ...sanitized } = admin;

export default {
  ...sanitized,
  ...editor
};
