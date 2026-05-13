<template>
  <div class="hello flex-col">
    <image-vue class="hello-logo" src="logo.svg" width="56px" />

    <div class="hello-header xlarge">Crypto App Template</div>
    <div class="hello-text small">
      A minimal Vue 3 + Vite starter for crypto apps. Wallet connect, multi-chain config,
      router + state baseline.
    </div>

    <div v-if="isConnected" class="hello-text">
      <div class="xsmall" v-if="selectedChain && selectedWallet">
        Connected to
        <span class="highlighted">
          {{ selectedChain.label ?? "Unsupported Chain" }}
        </span>
        through
        <span class="highlighted"> {{ selectedWallet.label ?? "Unsupported Wallet" }} </span>.
      </div>
      <div class="hello-text xxsmall" v-if="userAddress">
        <span class="highlighted">{{ userAddress }}</span>
        has
        <span class="highlighted"> {{ formatBN(userBalance?.div(1e18), 2) }}</span> ether.
      </div>
    </div>
    <div v-else-if="isConnecting" class="hello-text xsmall">
      Wallet interaction is initiated. Check your wallet.
    </div>
    <div v-else class="hello-text xxsmall">No wallet connection is detected.</div>

    <div class="hello-button-wrapper">
      <button-vue
        class="hello-button"
        bold
        text="Hello!"
        color="var(--color-purple)"
        @click="sayHi"
        :pending="pending"
        border
        shouldConnect
      />
    </div>

    <a class="github-logo hoverable" :href="repo_url" target="_blank" rel="noopener noreferrer">
      <image-vue src="github.svg" width="24px" />
      <div class="version xxxxsmall">
        {{ app_version }}
      </div>
    </a>

    <!-- todo: loading bar doesnt work for router yet? -->
    <!-- <router-link to="/momo">momo</router-link> -->
  </div>
</template>

<script setup>
/* global APP_VERSION */
/* global REPOSITORY_URL */

import timeout from "@/common/timeout"
import { formatBN } from "@/common/format"
import { storeToRefs } from "pinia"
import { ref, onMounted } from "vue"

import { useWalletStore } from "@/stores/walletStore"
const walletStore = useWalletStore()
const { isConnected, isConnecting, userAddress, userBalance, selectedChain, selectedWallet } =
  storeToRefs(walletStore)

import { useToast } from "vue-toastification"
const toast = useToast()
const pending = ref(true)

const app_version = ref()
const repo_url = ref()

async function sayHi() {
  if (isConnected.value) {
    pending.value = true
    await timeout(300)
    toast.info(`Hello, ${userAddress.value.slice(0, 6)}…${userAddress.value.slice(-4)}!`)
    pending.value = false
  }
}

onMounted(async () => {
  app_version.value = APP_VERSION
  repo_url.value = REPOSITORY_URL
  await timeout(300)
  pending.value = false
  console.log()
})
</script>

<style scoped>
.hello {
  position: relative;
}
.hello-header,
.hello-text,
.hello-button-wrapper {
  padding: var(--norm-pad);
}

.hello-header {
  padding-bottom: 0;
}

.hello-button {
  -webkit-backdrop-filter: var(--blur); /* Add this line first, it fixes blur for Safari*/
  backdrop-filter: var(--blur);
  max-height: 40px;
  background: linear-gradient(0deg, rgba(7, 3, 26, 0.2), rgba(7, 3, 26, 0.2)),
    linear-gradient(0deg, rgba(10, 23, 153, 0.02), rgba(10, 23, 153, 0.02));
}
.github-logo {
  position: absolute;
  justify-self: flex-end;
  bottom: 0;
  padding: var(--norm-pad);
}
.version {
  color: var(--color-text-muted);
}
.highlighted,
a {
  color: #42b983;
}

a {
  text-decoration: underline;
}
</style>
