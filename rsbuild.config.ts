import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/main.tsx',
    },
  },
  html: {
    template: './index.html',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://backend-production-7668.up.railway.app',
        changeOrigin: true,
        secure: false, // In case of self-signed certs, though Railway is usually valid
      },
    },
  },
})
