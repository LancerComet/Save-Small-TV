import { defineConfig } from 'vite'

export default defineConfig({
  // 基础路径，用于 GitHub Pages 部署
  base: '/save-small-tv/',

  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: true,
    // 兼容性目标
    target: 'es2015'
  },

  // 开发服务器配置
  server: {
    port: 3000,
    open: true
  },

  // CSS 配置
  css: {
    // Stylus 支持是内置的
  },

  // 解析配置
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
