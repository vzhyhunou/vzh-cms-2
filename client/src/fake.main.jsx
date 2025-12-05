import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import config from './config';
import provider from './provider/fake';

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={config.basename}>
    <App {...{ ...config, provider }} />
  </BrowserRouter>
);
