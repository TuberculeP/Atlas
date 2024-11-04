import { readFileSync } from "node:fs";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: false,
  },

  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
    build: {
      target: "esnext",
    },
  },

  modules: [
    // ...
    "@pinia/nuxt",
    "shadcn-nuxt",
    "@nuxtjs/tailwindcss",
  ],

  compatibilityDate: "2024-11-01",
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
});