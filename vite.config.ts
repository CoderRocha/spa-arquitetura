/// <reference types="vitest/config" />
import { lingui } from '@lingui/vite-plugin'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { msw } from 'msw/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import pkg from './package.json' with { type: 'json' }

const specsSetup = ['src/mocks/setup-specs.ts']

export default defineConfig(({ mode }) => ({
  plugins: [
    mode !== 'test' && devtools(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routeFileIgnorePattern: '__specs__',
    }),
    react(),
    babel({ plugins: ['@lingui/babel-plugin-lingui-macro'] }),
    lingui(),
    tailwindcss(),
    mode === 'mock' && msw({ mode: 'worker-only' }),
    mode === 'stats' && visualizer({ filename: 'dist/stats.html', gzipSize: true, open: false }),
  ],
  resolve: { tsconfigPaths: true },
  server: mode === 'mock' ? {} : { proxy: { '/api': 'http://localhost:8787' } },
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/{core,pattern,features}/**/__specs__/*.spec.{ts,tsx}'],
          environment: 'jsdom',
          setupFiles: specsSetup,
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: ['src/routes/__specs__/*.spec.tsx'],
          environment: 'jsdom',
          setupFiles: specsSetup,
          testTimeout: 15_000,
        },
      },
      {
        extends: true,
        test: {
          name: 'server',
          include: ['server/**/__specs__/*.spec.ts'],
          environment: 'node',
          testTimeout: 20_000,
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['src/ui/__specs__/*.spec.tsx'],
          setupFiles: ['src/ui/__specs__/setup-browser.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
}))
