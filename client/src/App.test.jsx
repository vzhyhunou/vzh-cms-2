import React from 'react';
import { render, screen, configure } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from './App';
import config from './config';

configure({ asyncUtilTimeout: 10000 });

const renderWithHistory = (route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App {...{ config }} />
    </MemoryRouter>
  );

describe('App', () => {
  it('should render home page', async () => {
    renderWithHistory();
    expect(await screen.findByText('Home page')).toBeDefined();
    expect(document.title).toEqual('Home page');
  });

  it('should render login page', async () => {
    renderWithHistory('/login');
    expect(await screen.findByText('Sign in')).toBeDefined();
  });
});
