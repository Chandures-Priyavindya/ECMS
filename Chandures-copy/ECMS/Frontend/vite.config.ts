import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

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
})
