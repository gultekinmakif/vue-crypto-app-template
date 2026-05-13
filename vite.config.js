/* global process */

import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dns from "node:dns"

import vueDevTools from "vite-plugin-vue-devtools"
import { ViteImageOptimizer } from "vite-plugin-image-optimizer"
import { robots } from "vite-plugin-robots"

dns.setDefaultResultOrder("verbatim")
const watch = process.argv.slice(2).includes("--watch")

import packageJson from "./package.json"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    APP_VERSION: JSON.stringify(packageJson.version),
    REPOSITORY_URL: JSON.stringify(packageJson.repository.url),
  },
  build: {
    //Generates sourcemaps for the built files,
    //aiding in debugging.
    sourcemap: true,
    //Clears the output directory before building.
    emptyOutDir: !watch,
  },
  plugins: [
    vue(),
    vueDevTools(),
    ViteImageOptimizer(),
    robots({ outputRobotsFileName: "robots.txt" }),
  ],
})
