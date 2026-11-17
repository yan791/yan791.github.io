import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  define: { __DATA_BUILD__: JSON.stringify(new Date().toISOString()) },
  // O projeto mora no OneDrive: sem isso os node_modules (atalhos da nuvem) quebram o build.
  resolve: { preserveSymlinks: true },
  server: { port: 5330, strictPort: true },
  preview: { port: 5331, strictPort: true },
  build: { target: 'es2022' },
  test: { environment: 'node' },
})
