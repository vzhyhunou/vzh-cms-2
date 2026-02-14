import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';

import Component from '../Component';

export default ({ node: { attrs } }) => (
  <NodeViewWrapper style={{ border: '2px dashed', opacity: 0.5 }}>
    <Component {...attrs} />
  </NodeViewWrapper>
);
