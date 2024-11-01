    import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Esto hace que Vite escuche en todas las IPs de la máquina
    port: 5173  // El puerto puede ser el que prefieras
  }
})
