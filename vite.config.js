import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    !process.env.VITEST ? uni() : null,
  ].filter(Boolean),
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
