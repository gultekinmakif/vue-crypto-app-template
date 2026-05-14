/* global process */

import { fileURLToPath, URL } from "node:url"
import { copyFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dns from "node:dns"

import vueDevTools from "vite-plugin-vue-devtools"
import { ViteImageOptimizer } from "vite-plugin-image-optimizer"
import { robots } from "vite-plugin-robots"

dns.setDefaultResultOrder("verbatim")
const watch = process.argv.slice(2).includes("--watch")

import packageJson from "./package.json"

// GitHub Pages serves project pages from /<repo>/. The deploy workflow
// sets BASE_PATH; locally and on other hosts it stays "/".
const base = process.env.BASE_PATH ?? "/"

// GitHub Pages 404s on direct hits to non-root SPA routes. Copy
// dist/index.html to dist/404.html after the bundle is written so
// every path falls back to the SPA entry.
const spa404Fallback = {
  name: "spa-404-fallback",
  apply: "build",
  closeBundle() {
    const outDir = resolve(fileURLToPath(new URL("./dist", import.meta.url)))
    const index = resolve(outDir, "index.html")
    if (existsSync(index)) copyFileSync(index, resolve(outDir, "404.html"))
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  base,
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
    spa404Fallback,
  ],
})
