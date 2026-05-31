import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/predict-api': {
        target: 'https://predict-server.testnet.mystenlabs.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/predict-api/, ''),
      },
    },
  },
})
