import React, { createElement } from 'react';
import { Route, useParams } from 'react-router-dom';

import Context from './Context';
import Admin from './Admin';
import Component from './ui/Component';

const Element = (props) => {
  const { '*': extra, ...p } = useParams();
  return <Component {...{ ...p, ...props }} />;
};

const parse = ({ element, children = [], ...rest }) =>
  createElement(Route, {
    element: <Element {...element} />,
    children: children.map(parse),
    ...rest
  });

export default ({ config }) => (
  <Context {...config}>
    <Admin>{parse}</Admin>
  </Context>
);
