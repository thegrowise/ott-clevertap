/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GROWISE_API_KEY: string
  readonly VITE_GROWISE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.json' {
  const value: any
  export default value
}
