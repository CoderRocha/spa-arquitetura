import { defineConfig } from '@lingui/conf'

export default defineConfig({
  sourceLocale: 'pt-BR',
  locales: ['pt-BR', 'en'],
  catalogs: [
    {
      path: '<rootDir>/src/core/locales/{locale}',
      include: ['<rootDir>/src'],
      exclude: ['**/__specs__/**'],
    },
  ],
})
