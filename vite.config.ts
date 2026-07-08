import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Déployé sur diffonathan.github.io → URL racine.
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5187,
  },
  build: {
    rollupOptions: {
      output: {
        // Three.js dans son propre chunk (chargé en différé par le hero)
        manualChunks(id: string) {
          if (id.includes('node_modules/three')) return 'three'
        },
      },
    },
  },
})
