import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['ess-frontend-ref-for-biome-lintstaged-husky-cspell/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'src/components/ui/**',
        'node_modules/**',
        'dist/**',
        'coverage/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/test/**',
        '**/__tests__/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 60,
          lines: 30,
          statements: 30,
        },
        'src/lib/**': {
          branches: 85,
          functions: 60,
          lines: 65,
          statements: 65,
        },
        'src/hooks/**': {
          branches: 100,
          functions: 70,
          lines: 80,
          statements: 80,
        },
        'src/components/errors/**': {
          branches: 75,
          functions: 100,
          lines: 85,
          statements: 85,
        },
      },
    },
  },
})
