/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
