/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  interface Window {
    dataLayer?: unknown[]
    gtag?(
      ...args:
        | [command: 'js', date: Date]
        | [command: 'config', measurementId: string, config?: { send_page_view?: boolean }]
        | [command: 'event', eventName: string, params?: Record<string, unknown>]
    ): void
  }
}

export {}
