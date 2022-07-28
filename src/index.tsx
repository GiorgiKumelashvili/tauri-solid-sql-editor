/* @refresh reload */
import 'windi.css';

import { render } from 'solid-js/web';
import { Router } from 'solid-app-router';
import App from './app';
import './app.css'
render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('root') as HTMLElement,
);

