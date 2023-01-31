import React from 'react';
import { io } from 'socket.io-client';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';

import { App } from '../src/components/App';
import './index.scss';

const socket = io();
const container = document.getElementById('root')!;
const root = createRoot(container);
const app: JSX.Element = (
  <Provider store={store}>
    <BrowserRouter>
      <App socket={socket} />
    </BrowserRouter>
  </Provider>
);
root.render(app);
