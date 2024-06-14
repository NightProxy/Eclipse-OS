import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'public', // Ensure Vite looks in the right place
  build: {
    outDir: '../dist',
  },
});
