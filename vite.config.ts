import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path/win32'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 👈 esto crea el alias "@"
    },
  },
})
