import { defineConfig, loadEnv } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

const { publicVars } = loadEnv({ prefixes: ['PUBLIC_'] })

// Transform publicVars to also map to import.meta.env
const envVars = Object.entries(publicVars).reduce(
  (acc, [key, value]) => {
    acc[`import.meta.env.${key}`] = value
    acc[`process.env.${key}`] = value
    acc[key] = value
    return acc
  },
  {} as Record<string, string>
)

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/main.tsx',
    },
    define: {
      ...envVars,
    },
  },
  html: {
    template: './index.html',
  },
})
