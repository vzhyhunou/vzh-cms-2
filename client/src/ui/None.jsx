import React from 'react';

import Component from './Component';
import { useSettings } from '../context/SettingsContext';

export default () => {
  const settings = useSettings();

  if (!settings) {
    return null;
  }

  return <Component {...settings.schema.components.none} />;
};
