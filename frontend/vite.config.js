import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(async ({ command }) => {
  const plugins = [react()]

  if (command === 'build') {
    try {
      const prerenderModule = await import('vite-plugin-prerender')
      const prerender = prerenderModule.default || prerenderModule
      const routesModule = await import('./prerender-routes.js')
      const preRenderRoutes = routesModule.preRenderRoutes || routesModule.default

      plugins.push(
        prerender({
          routes: preRenderRoutes,
          additional: preRenderRoutes,
          eol: 'lf',
        })
      )
    } catch (err) {
      // If the plugin isn't installed in dev, don't fail — warn and continue.
      // During CI/build on Render the dependency should be present.
      // eslint-disable-next-line no-console
      console.warn('vite-plugin-prerender not available:', err.message)
    }
  }

  return {
    plugins,
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
  }
})
