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
    "@vite-pwa/nuxt",
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
  pwa: {
    manifest: {
      name: "pwa nuxt 3",
      short_name: "pwa nuxt",
      theme_color: "#8a8a5e",
      description: "Arman Abi r.man.abi@gmail.com",
      icons: [],
    },
    workbox: {
      navigateFallback: "/",
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },
});
