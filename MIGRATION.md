# Migration notes

> This document is AI generated.

A record of dependency bumps applied during the 2026-05 modernization pass.
Tracks each package, what changed, and whether any code edits were needed.

## Dependencies

| package | old pin | new pin | major bump? | code change required | notes |
|---|---|---|---|---|---|
| `@aacassandra/vue3-progressbar` | `^1.0.3` | `^1.0.3` | no | none | unchanged; no newer release |
| `@web3-onboard/core` | `^2.22.1` | `^2.24.1` | no | none | v2.x remains the maintained line; v3 was an experimental Web3Modal-style fork that did not stick — do not bump to v3 |
| `@web3-onboard/injected-wallets` | `^2.11.1` | `^2.11.3` | no | none | |
| `axios` | `^1.7.2` | `^1.16.1` | no | none | |
| `bignumber.js` | `^9.1.2` | `^11.1.1` | yes (9 → 10 → 11) | none | usage in `src/common/{BN,format}.js` + `src/stores/walletStore/index.js` is `BN(v).div().decimalPlaces().toFixed().toString()` plus `BN.config({ROUNDING_MODE, EXPONENTIAL_AT})` — all stable across the v10 / v11 cuts |
| `ethers` | `^6.13.0` | `^6.16.0` | no | none | v7 not released yet |
| `pinia` | `^2.1.7` | `^3.0.4` | yes | none | v3 drops Vue 2 + some deprecated APIs. The store in `src/stores/walletStore/index.js` already uses the setup-syntax form `defineStore('wallet', () => { ... })`, which is the supported v3 shape |
| `vue` | `^3.4.21` | `^3.5.34` | no | none | minor bump; v3.5 ships reactivity / SSR improvements with no template breaking changes used here |
| `vue-router` | `^4.3.2` | `^5.0.7` | yes | none | per upstream, v5 is a "boring release" that merges unplugin-vue-router into core with no breaking changes to `createRouter`, `createWebHistory`, or `beforeEach` |
| `vue-toastification` | `^2.0.0-rc.5` | `^2.0.0-rc.5` | n/a | none | npm `latest` dist-tag still points at the Vue-2 `1.7.14` line; the Vue-3 build is on the `next` dist-tag and is still tagged `2.0.0-rc.5`. Pin stays on the rc until a stable v2 lands |
| `web3` | `^4.9.0` | (removed) | n/a | yes | dropped in favor of `ethers` — `Web3.utils.toChecksumAddress` replaced with `ethers.getAddress`; `new Web3(provider).eth.getBalance` replaced with `new BrowserProvider(provider).getBalance` |

## Dev dependencies

| package | old pin | new pin | major bump? | code change required | notes |
|---|---|---|---|---|---|
| `@rushstack/eslint-patch` | `^1.8.0` | `^1.16.1` | no | none | |
| `@vitejs/plugin-vue` | `^5.0.4` | `^6.0.6` | yes | none | peer-deps now `vite ^5 \|\| ^6 \|\| ^7 \|\| ^8` and `vue ^3.2.25` — matches our Vue + Vite pins |
| `@vue/eslint-config-prettier` | `^9.0.0` | `^9.0.0` | n/a (deferred) | none | v10 requires ESLint v9 flat-config; deferred with the ESLint migration |
| `autoprefixer` | `^10.4.19` | `^10.5.0` | no | none | |
| `eslint` | `^8.57.0` | `^8.57.1` | n/a (deferred) | none | v9 flat-config migration deferred to a follow-up; v8 is still supported by the current `.eslintrc.cjs` setup |
| `eslint-plugin-vue` | `^9.23.0` | `^9.33.0` | n/a (deferred) | none | tied to ESLint v8 |
| `prettier` | `^3.2.5` | `^3.8.3` | no | none | |
| `serve` | `^14.2.3` | `^14.2.6` | no | none | |
| `sharp` | `^0.33.4` | `^0.34.5` | yes (0.x major-equivalent) | none | required by `vite-plugin-image-optimizer` v2 (peerDep `sharp >=0.34.0`) |
| `svgo` | `^3.3.2` | `^4.0.1` | yes | none | required by `vite-plugin-image-optimizer` v2 (peerDep `svgo >=4`); we do not call svgo directly, only through the Vite plugin |
| `vite` | `^5.2.0` | `^8.0.12` | yes (5 → 6 → 7 → 8) | none | three majors at once. The plugins we use (`@vitejs/plugin-vue` v6, `vite-plugin-vue-devtools` v8, `vite-plugin-image-optimizer` v2) all declare `vite ^8` in their peer-deps. `vite-plugin-robots` accepts the new range too — verified by a clean `bun run build` |
| `vite-plugin-image-optimizer` | `^1.1.8` | `^2.0.3` | yes | none | forces the `sharp >=0.34` and `svgo >=4` bumps above |
| `vite-plugin-robots` | `^1.0.5` | `^1.0.5` | no | none | unchanged; no newer release |
| `vite-plugin-vue-devtools` | `^7.2.1` | `^8.1.2` | yes | none | peer-deps `vite ^6 \|\| ^7 \|\| ^8` — matches our Vite pin |

## Deferred follow-ups

- **ESLint v8 → v9 (flat-config).** v9 removes `--ignore-path`, removes the legacy `.eslintrc.cjs` resolution, and requires migrating to `eslint.config.js`. Out of scope here; tracked for a separate commit. While deferred, `@vue/eslint-config-prettier` stays on v9 and `eslint-plugin-vue` stays on the v9 line to match.
