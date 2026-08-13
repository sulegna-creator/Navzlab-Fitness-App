import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // THIS IS THE FIX: It tells the phone to look inside the app for files
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  }
});
