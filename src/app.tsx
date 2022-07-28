import { invoke } from '@tauri-apps/api/tauri';
import { createCodeMirror, createEditorControlledValue } from 'solid-codemirror';
import { Component, createSignal, onMount } from 'solid-js';
// import { lineNumbers } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, minimalSetup } from 'codemirror';

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
} from '@codemirror/language';

const App: Component = () => {
  let editorEl!: HTMLDivElement;

  const { ref: editorRef, createExtension, editorView } = createCodeMirror();
  const theme = EditorView.theme({
    '1': {
      background: 'red',
    },
  });

  createExtension(theme);
  createExtension(oneDark);
  createExtension(lineNumbers);
  createEditorControlledValue(editorView, () => '');
  createExtension(EditorView.lineWrapping);
  createExtension(keymap.of([...defaultKeymap]));

  async function handleClick(event) {
    // Invoke the command from our backend using the invoke function
    const result = await invoke('return_string', {
      word: 'This is the argument',
    });

    // print the result to an alert
    alert(result);
  }

  async function handleClick2() {
    await invoke('my_custom_command');
  }

  //   const minimalSetup = /*@__PURE__*/(() => [
  //     highlightSpecialChars(),
  //     history(),
  //     drawSelection(),
  //     syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  //     keymap.of([
  //         ...defaultKeymap,
  //         ...historyKeymap,
  //     ])
  // ])();

  // onMount(() => {
  //   let view = new EditorView({
  //     doc: '...',
  //     parent: document.getElementById('test'),
  //     extensions: [
  //       // highlightSpecialChars(),
  //       // history(),
  //       // drawSelection(),
  //       // syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  //       keymap.of([...defaultKeymap]),
  //     ],
  //     // extensions:[drawSelection(),highlightSpecialChars()]
  //   });

  //   //  let view = new EditorView({
  //   //   doc:'...',
  //   //   parent: document.getElementById('test'),
  //   //   extensions:minimalSetup
  //   // });
  // });

  return (
    <>
      <div>
        <button onClick={handleClick}>Click Me</button>
        <br />
        <button style={{ border: '1px solid black' }} onClick={handleClick2}>
          Click Me 2
        </button>

        <div ref={editorRef} />
        {/* <div id="test"></div> */}
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

