import { defineConfig } from 'vite'

export default defineConfig(context => {
  const isDev = context.mode === 'development'

  return {
    base: isDev ? '/' : '/Save-Small-TV/',

    build: {
      outDir: 'dist'
    },

    server: {
      port: 3000,
      host: '0.0.0.0'
    }
  }
})
