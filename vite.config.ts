import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './playground/playground/components'),
      '@/core': path.resolve(__dirname, './playground/playground'),
      '@/types': path.resolve(__dirname, './playground/playground/components/simulated-hardwares/modules/neopixel-display/types'),
      '@/utils': path.resolve(__dirname, './playground/playground'),
      '@/features': path.resolve(__dirname, './playground/playground'),
      '@/content': path.resolve(__dirname, './playground'),
    },
  },
  server: {
    port: 3001,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})