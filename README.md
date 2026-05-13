# vue-crypto-app-template

A minimal Vue 3 + Vite starter for crypto / web3 apps. Wallet connect, multi-chain config, and a router/state baseline — drop in your contract calls and ship.

## What's inside

- **Vue 3** + **Vite 5** with `<script setup>` SFCs
- **`@web3-onboard/core`** + injected-wallets for wallet connection (MetaMask, Rabby, etc.)
- **ethers v6** and **web3.js v4** both bundled — pick one per call
- **Pinia** store (`walletStore`) wrapping the onboard state
- **vue-router 4** scaffolded with a single route
- **vue-toastification** for transient UI feedback
- **bignumber.js** for safe on-chain math
- ESLint + Prettier configured for Vue SFCs
- No TypeScript, no JSX, no Webpack — keeps the boilerplate readable

## Quick start

```sh
bun install
bun run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Configure your chains

Chain configs live in [`src/stores/walletStore/index.js`](./src/stores/walletStore/index.js) under `_chains`. The included examples are Holesky, Fuji, Avalanche C-Chain, and Ethereum Mainnet. Add or remove as needed:

```js
const _chains = {
  myChain: {
    id: "0x...",            // hex chainId
    token: "ETH",
    label: "My Chain",
    rpcUrl: "https://...",
  },
  // ...
}
```

- `_chains_default` sets the chain a fresh visitor lands on.
- `_chains_not_ready` lists chains that surface as "coming soon" but don't block connection.

## Wire wallet-onboard

Get your own Blocknative `apiKey` at [explorer.blocknative.com](https://explorer.blocknative.com/account) and drop it into the `Onboard({ apiKey: "..." })` call in `walletStore/index.js`. The template ships with an empty key — it works locally without one, but production wallet flows need your own.

## Scripts

| Command | What it does |
|---|---|
| `bun run dev` | Vite dev server with HMR |
| `bun run build` | Production bundle into `dist/` |
| `bun run watch` | Production build that rebuilds on change |
| `bun run serve` | Serve a prebuilt `dist/` on localhost |
| `bun run preview` | Vite preview server (built bundle) |
| `bun run lint` | ESLint with `--fix` over `.vue`, `.js`, `.jsx`, `.cjs`, `.mjs` |
| `bun run pretty` | Prettier across the project |

## Recommended IDE

[VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar). Disable Vetur if you have it.

## Deploying to GitHub Pages

`bun run build` produces a static `dist/` that GitHub Pages can serve. For a project page at `https://<user>.github.io/<repo>/`, set the Vite base path before building:

```js
// vite.config.js
export default defineConfig({
  base: "/<repo>/",
  // ...
})
```

The router uses HTML5 history mode (`createWebHistory`), so refreshing on a non-root path 404s by default. Copy `dist/index.html` to `dist/404.html` after the build and GitHub Pages will serve the SPA on every path.

## Using this as a template

This repo is set up as a GitHub Template. Click **Use this template** on the repo page, or:

```sh
gh repo create my-app --template gultekinmakif/vue-crypto-app-template --private --clone
```

## License

[MIT](./LICENSE).
