import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from 'vite-plugin-prerender'
import { preRenderRoutes } from './prerender-routes.js'

export default defineConfig({
  plugins: [
    react(),
    prerender({
      routes: preRenderRoutes,
      additional: preRenderRoutes,
      eol: 'lf',
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
})
