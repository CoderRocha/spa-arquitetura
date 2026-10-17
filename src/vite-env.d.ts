/// <reference types="vite/client" />

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- merges with Vite's global interface
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

declare const __APP_VERSION__: string

declare module '*.po' {
  import type { Messages } from '@lingui/core'
  export const messages: Messages
}
