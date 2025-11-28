import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import config from './config';

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={config.basename}>
    <App {...config} />
  </BrowserRouter>
);
