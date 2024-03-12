import { defineConfig } from 'vite'
import postcss from '@vituum/vite-plugin-postcss'
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
  plugins: [postcss()],
})
