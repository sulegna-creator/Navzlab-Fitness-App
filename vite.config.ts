import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // THIS IS THE CRITICAL LINE TO FIX THE BLACK SCREEN
  base: './', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
