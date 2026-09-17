import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages sirve el sitio bajo /presentacion-piml/
  base: '/presentacion-piml/',
  plugins: [react(), tailwindcss()],
});
