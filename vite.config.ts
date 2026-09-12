import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      'import.meta.env.OPENROUTER_API_KEY_2048': JSON.stringify(
        env.OPENROUTER_API_KEY_2048 ?? '',
      ),
    },
    resolve: {
      alias: {
        '@game': fileURLToPath(new URL('./src/game', import.meta.url)),
        '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
        '@suggestions': fileURLToPath(new URL('./src/suggestions', import.meta.url)),
      },
    },
  }
})
