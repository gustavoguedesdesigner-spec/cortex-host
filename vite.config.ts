import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuracao base do Vite para o CORTEX HOST.
// Sem dependencias de backend nesta etapa: aplicacao 100% front-end com dados simulados.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
})
