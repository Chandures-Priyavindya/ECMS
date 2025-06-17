

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.cjs'),
  },
  server: {
    proxy: {
      // Send ONLY clustering requests to FastAPI
      '^/api/clustering': {
        target: 'http://localhost:8000', // FastAPI running here
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/clustering/, '/api/clustering'),
      },
      // Everything else under /api goes to Node.js backend
      '^/api': {
        target: 'http://localhost:5000', // Node.js backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
