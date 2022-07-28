import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import WindiCSS from 'vite-plugin-windicss';

export default defineConfig({
  plugins: [solidPlugin(), WindiCSS()],
  build: {
    target: 'esnext',
  },
  server:{
    host:true
  },
  optimizeDeps: {
    // Add both @codemirror/state and @codemirror/view to included deps to optimize
    include: ['@codemirror/state', '@codemirror/view'],
  }
});
