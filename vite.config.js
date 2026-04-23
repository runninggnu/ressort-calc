import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Build for static hosting; output goes to dist/
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
