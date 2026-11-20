import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), tailwindcss(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build: {
    outDir: mode === 'single' ? 'dist-single' : 'dist',
    // Xaridorlar ilovasi va panellar alohida sahifalar
    rollupOptions: mode === 'single' ? undefined : {
      input: { main: 'index.html', admin: 'admin.html', boshliq: 'boshliq.html' },
    },
  },
}))
