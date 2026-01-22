/// <reference types="@rsbuild/core/types" />

interface ImportMetaEnv {
  readonly PUBLIC_SENTRY_DSN: string
  readonly PUBLIC_GOOGLE_CLIENT_ID: string
  readonly API_BASE_URL: string
  readonly API_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
