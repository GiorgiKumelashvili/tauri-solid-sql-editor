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

import {
  closeBrackets,
  autocompletion,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';

import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';

import { sql } from '@codemirror/lang-sql';

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
    // Invoke the command from our backend using the invoke function
    const result = await invoke('return_string', {
      word: 'This is the argument',
    });

    // print the result to an alert
    alert(result);
  }

  async function showFile() {
    const content = await readTextFile('/Users/giorgi/Documents/test.js');

    const newState = EditorState.create({
      doc: content,
      extensions,
    });

    editorView().setState(newState);
  }

  return (
    <>
      <div>
        <button onClick={handleClick}>Click Me</button>
        <br />
        <button onClick={showFile}>Read file content</button>
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

