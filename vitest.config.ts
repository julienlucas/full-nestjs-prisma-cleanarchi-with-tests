import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    globals: true,
    alias: {
      '@domain': path.resolve(__dirname, 'src/domain'),
      '@infrastructure': path.resolve(__dirname, 'src/infrastructure'),
      '@tests': path.resolve(__dirname, 'tests'),
    },
    root: './',
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' }
    })
  ],
});