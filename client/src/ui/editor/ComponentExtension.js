import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import ComponentWrapper from './ComponentWrapper.jsx';

export default Node.create({
  name: 'reactComponent',
  group: 'inline',
  inline: true,

  addAttributes() {
    return {
      resource: {},
      name: {},
      id: {}
    };
  },

  parseHTML() {
    return [
      {
        tag: 'react-component'
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['react-component', HTMLAttributes];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ComponentWrapper);
  },

  addCommands() {
    return {
      insertComponent:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options
          });
        }
    };
  }
});
