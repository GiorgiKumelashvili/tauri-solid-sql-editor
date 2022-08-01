/* @refresh reload */
import 'windi.css';

import { render } from 'solid-js/web';
import { Router } from 'solid-app-router';
import App from './app';
import './app.css';

import { appWindow } from '@tauri-apps/api/window';

document.getElementById('titlebar-minimize').addEventListener('click', () => appWindow.minimize());
document
  .getElementById('titlebar-maximize')
  .addEventListener('click', () => appWindow.toggleMaximize());
document.getElementById('titlebar-close').addEventListener('click', () => appWindow.close());

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('root') as HTMLElement
);

