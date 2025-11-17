import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// Adicionado para resolver o alias '@'
import { fileURLToPath, URL } from 'node:url' 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Configuração para resolver o alias '@'
  resolve: {
    alias: {
      // Mapeia '@' para o diretório 'src'
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})