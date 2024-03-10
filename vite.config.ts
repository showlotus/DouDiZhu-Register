import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: './',
  build: {
    outDir: 'website',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
