import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.tsx', 'src/**/*.stories.tsx', 'src/App.tsx', 'src/main.tsx'],
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.build.json',
    }),
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'AaruUiKit',
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: (assetInfo) =>
          assetInfo.name === 'style.css' ? 'ui-kit.css' : (assetInfo.name ?? 'assets/[name][extname]'),
      },
    },
    sourcemap: true,
  },
});
