import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { portfolioAssistantMiddleware } from './server/portfolioAssistantMiddleware'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load only server credentials here, never into import.meta.env or define.
  const env = loadEnv(mode, process.cwd(), 'GEMINI_')
  return {
    plugins: [
      react(),
      {
        name: 'portfolio-assistant-api',
        configureServer(server) {
          server.middlewares.use(portfolioAssistantMiddleware(env))
        },
        configurePreviewServer(server) {
          server.middlewares.use(portfolioAssistantMiddleware(env))
        },
      },
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['framer-motion', 'lucide-react'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  }
})
