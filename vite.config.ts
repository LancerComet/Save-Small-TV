import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Save-Small-TV/',

  build: {
    outDir: 'dist'
  },

  server: {
    port: 3000
  },

  css: {
  },

  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
