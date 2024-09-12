import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://103.119.54.76:8989',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/JPxDataClass'),
      },
    },
  }
});
