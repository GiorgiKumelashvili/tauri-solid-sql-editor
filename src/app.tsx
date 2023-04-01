import { invoke } from '@tauri-apps/api/tauri';
import { createCodeMirror } from 'solid-codemirror';
import { Component, createEffect, createSignal, on, onMount } from 'solid-js';
// import { lineNumbers } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, minimalSetup } from 'codemirror';

import Codemirror from 'codemirror';

import {
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  keymap,
} from '@codemirror/view';

import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';

import {
  foldGutter,
  indentOnInput,
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
  foldKeymap,
  language,
} from '@codemirror/language';
import { BaseDirectory, readTextFile } from '@tauri-apps/api/fs';

import { EditorState, Extension } from '@codemirror/state';

import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';

import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';

import { sql } from '@codemirror/lang-sql';
import { ask, confirm, message, open, save } from '@tauri-apps/api/dialog';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { getCurrent, getAll } from '@tauri-apps/api/window';
import { appDir } from '@tauri-apps/api/path';
import { Command } from '@tauri-apps/api/shell';
import { WebviewWindow } from '@tauri-apps/api/window';
// import { WebviewWindow } from '@tauri-apps/api/window';

//! IMPORTANT
//TODO create custom ui desktop like library in pure css for pure perfomance or tailwind core
//TODO folder for core components and ui compononents for desktop ui

//TODO clone rust sql client and make into into submmodule also decipher (its just missing mssql, mongo, redis)
//TODO decipher codemirror plugin core and solid js as well might as well clone solid-codemirror

//TODO create codemirror organization and add all submodule

const extensions: Extension = [
  EditorView.theme({}),
  oneDark,
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  foldGutter(),
  indentOnInput(),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),

  dropCursor(),
  EditorState.allowMultipleSelections.of(true),

  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),

  sql(),

  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
  ]),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
];

const App: Component = () => {
  const { ref: editorRef, createExtension, editorView } = createCodeMirror({
    value: '...',
  });

  onMount(() => {
    createExtension(extensions);
  });

  async function handleClick(event) {
    // // Invoke the command from our backend using the invoke function
    // const result = await invoke('return_string', {
    //   word: 'This is the argument',
    // });

    // // print the result to an alert
    // alert(result);

    // const yes = await ask('Are you sure?', 'Tauri');
    // const yes2 = await ask('This action cannot be reverted. Are you sure?', { title: 'Tauri', type: 'info' });

    // const confirmed2 = await confirm('This action cannot be reverted. Are you sure?', {
    //   title: 'Tauri',
    //   type: 'warning',
    // });

    // await message('File not found', { title: 'Tauri', type: 'error' });

    // const selected = await open({
    //   multiple: true,
    //   filters: [
    //     {
    //       name: 'Image',
    //       extensions: ['png', 'jpeg'],
    //     },
    //   ],
    // });
    // if (Array.isArray(selected)) {
    //   // user selected multiple files
    // } else if (selected === null) {
    //   // user cancelled the selection
    // } else {
    //   // user selected a single file
    // }

    // // Open a selection dialog for directories
    // const selected = await open({
    //   // recursive: true,
    //   title:'test',

    //   // directory: true,
    //   // multiple: true,
    //   defaultPath: await appDir(),
    // });

    // console.log(selected);

    // const filePath = await save({
    //   // multiple: true,
    //   defaultPath: await appDir(),
    //   filters: [
    //     {
    //       name: 'Image',
    //       extensions: ['svg', 'png']
    //     },
    //   ],
    // });

    // console.log(filePath);

    // let permissionGranted = await isPermissionGranted();
    // console.log(permissionGranted);

    // if (!permissionGranted) {
    //   const permission = await requestPermission();
    //   permissionGranted = permission === 'granted';
    // }
    // if (permissionGranted) {
    //   sendNotification('Tauri is awesome!');
    //   sendNotification({ title: 'TAURI', body: 'Tauri is awesome!' });
    // }

    // console.log(getCurrent());
    // console.log(getAll());

    // window.open('https://youtube.com');
    // console.log('https://youtube.com');
    //  await tauri.shell.open('https://example.com');

    // loading embedded asset:
    const webview = new WebviewWindow('theUniqueLabel-', {
      url: '../README.md',
      resizable: false,
      title: 'Settings',
    });

    // // alternatively, load a remote URL:
    // const webview = new WebviewWindow('theUniqueLabel', {
    //   url: 'https://github.com/tauri-apps/tauri',
    // });

    webview.once('tauri://created', function() {
      // webview window successfully created
      console.log('created');
    });
    webview.once('tauri://error', function(e) {
      // an error happened creating the webview window
      console.log('error');
    });
    const unlisten2 = await webview.onCloseRequested(async event => {
      console.log(123);

      const confirmed = await confirm('Are you sure?');
      if (!confirmed) {
        // user did not confirm closing the window; let's prevent it
        event.preventDefault();
      }
    });

    // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
    unlisten2();

    // emit an event to the backend
    await webview.emit('some event', 'data');
    // listen to an event from the backend
    const unlisten = await webview.listen('event name', e => {});
    unlisten();
  }

  async function showFile() {
    const content = await readTextFile('/Users/giorgi/Documents/test.js');

    const newState = EditorState.create({
      doc: content,
      extensions,
    });

    editorView().setState(newState);
  }

  const newWIndow = () => {
    console.log(123);
  };

  return (
    <>
      <div>
        <button class="btn" onClick={newWIndow}>
          New window 2
        </button>
        <br />
        <br />
        <button class="btn" onClick={handleClick}>
          Open native manu
        </button>
        <br />
        <br />
        <button class="btn" onClick={showFile}>
          Read file content
        </button>
        <br />
        <br />

        <div ref={editorRef} />
      </div>
    </>
  );
};

export default App;

// import type { Component } from 'solid-js';
// import { Link, useRoutes, useLocation } from 'solid-app-router';

// import { routes } from './routes';

// const App: Component = () => {
//   const location = useLocation();
//   const Route = useRoutes(routes);

//   return (
//     <>
//       <nav class="bg-gray-200 text-gray-900 px-4">
//         <ul class="flex items-center">
//           <li class="py-2 px-4">
//             <Link href="/" class="no-underline hover:underline">
//               Home
//             </Link>
//           </li>
//           <li class="py-2 px-4">
//             <Link href="/about" class="no-underline hover:underline">
//               About
//             </Link>
//           </li>
//           <li class="py-2 px-4">
//             <Link href="/error" class="no-underline hover:underline">
//               Error
//             </Link>
//           </li>

//           <li class="text-sm flex items-center space-x-1 ml-auto">
//             <span>URL:</span>
//             <input
//               class="w-75px p-1 bg-white text-sm rounded-lg"
//               type="text"
//               readOnly
//               value={location.pathname}
//             />
//           </li>
//         </ul>
//       </nav>

//       <main>
//         <Route />
//       </main>
//     </>
//   );
// };

// export default App;
