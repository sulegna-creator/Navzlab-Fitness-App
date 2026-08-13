import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Empty string is the "Magic Fix" for Capacitor Black Screens
  base: '', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  }
});
