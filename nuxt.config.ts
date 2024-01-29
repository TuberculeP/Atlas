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
  ],
});
