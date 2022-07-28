import { createMemo, createRoot, createSelector, createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

// id: 'sql',
// label: 'SQL',
// plugin: () => import('@codemirror/lang-sql').then(({sql}) => sql()),
// icons: [],

// code:
//       'function Counter() {\n' +
//       '  const [count, setCount] = createSignal(0);\n' +
//       '  \n' +
//       '  setInterval(\n' +
//       '    () => setCount(count() + 1),\n' +
//       '    1000\n' +
//       '  );\n' +
//       '\n' +
//       '  return <div>The count is {count()}</div>\n' +
//       '}' +
//       '\n',
//     // TODO: should be auto
//     languageId: 'typescript',
//     font: SUPPORTED_FONTS_DICTIONARY['jetbrains-mono'],

function $createEditorsStore() {
  const MAX_TABS = 6;
  const [options, setOptions] = getRootEditorOptions();

  const [editors, setEditors] = createStore([getInitialEditorState()]);
  const [ready, setReady] = createSignal(false);
  const [activeEditorId, setActiveEditorId] = createSignal<string>(defaultId);
  const isActive = createSelector(activeEditorId);

  onMount(async () => {
    // Versioning state tabs -> TODO: not needed if id is not createUniqueId from solid
    const editors = idbState.editors.slice(0, MAX_TABS).map(editor => ({
      ...editor,
      id: versionateId(editor.id),
    }));
    setOptions(idbState.options);
    setActiveEditorId(editors[0].id);
    setEditors(editors);
    setReady(true);
  });

  const font = createMemo(() => filter(SUPPORTED_FONTS, font => font.id === options.fontId)[0]);

  return {
    ready,
    editors,
    options,
    isActive,
  } as const;
}

const createEditorStore = createRoot($createEditorsStore);

export function getRootEditorStore() {
  return createEditorStore;
}

