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
        target: 'https://somos-yura-backend-g9q7b.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
