import { ref, computed, watch } from "vue"
import { defineStore } from "pinia"
import timeout from "@/common/timeout"

import Web3 from "web3"
import Onboard from "@web3-onboard/core"
import injectedModule from "@web3-onboard/injected-wallets"

import BN from "@/common/BN"
import icon from "./icon.svg"

import { useRoute } from "vue-router"
import { useToast } from "vue-toastification"

const _chains = {
  holesky: {
    id: "0x4268",
    token: "ETH",
    label: "Holesky Testnet",
    rpcUrl: "https://holesky.drpc.org",
  },
  fuji: {
    id: "0xa869",
    token: "AVAX",
    label: "Fuji Testnet",
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
  },
  avax: {
    id: "0xa86a",
    token: "AVAX",
    label: "Avalanche C-Chain",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
  },
  ethereum: {
    id: "0x01",
    token: "ETH",
    label: "Ethereum Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/",
  },
}

const _chains_not_ready = ["ethereum", "avax"]
const _chains_default = "holesky"
const _chains_values = Object.values(_chains)

// const _tx_links = {
//   holesky: "https://holesky.etherscan.io/tx",
// }
// const openTxLink = (hash) => {
//   window.open(`${_tx_links[route.query.chain]}/${hash}`, "noopener norefferer")
// }

const injected = injectedModule()
const onboard = Onboard({
  accountCenter: { desktop: { enabled: false }, mobile: { enabled: false } },
  wallets: [injected],
  chains: _chains_values,
  theme: "dark",
    // apiKey: "",// Add your Blocknative apiKey here if you want notify support.
  appMetadata: {
    name: "Crypto App Template",
    icon: icon,
    description: "A minimal Vue 3 + Vite starter for crypto apps.",
  },
  connect: {
    autoConnectLastWallet: true,
  },
  notify: {
    mobile: {
      enabled: true,
      position: "bottomRight",
    },
    desktop: {
      enabled: true,
      position: "topRight",
    },
  },
})

export const useWalletStore = defineStore("wallet", () => {
  // Store initializers
  const route = useRoute()

  // Store state
  const userAddress = ref("0x0000000000000000000000000000000000000000")
  const userBalance = ref(BN(0))
  const isConnecting = ref(false)

  // Onboard state
  const selectedChain = ref({})
  const selectedWallet = ref({})

  const connectedWallets = ref({})
  connectedWallets.value = onboard.state.select("wallets")
  // eslint-disable-next-line no-unused-vars
  const { unsubscribe: unsubscribe_wallets } = connectedWallets.value.subscribe(
    async function (update) {
      await processWallet(update)
    },
  )

  // Store internal functions
  const processChain = async function (
    [new_label, new_chains, new_accounts],
    [prev_label, prev_chains, prev_accounts],
  ) {
    const toast = useToast()
    if (new_label && new_chains && new_accounts) {
      if (new_label != prev_label) {
        toast.success(`Successfully connected to ${new_label}`)
      }

      if (new_label != prev_label || new_chains != prev_chains) {
        if (new_chains?.length > 0) {
          console.log("chain changed")

          const __desired_chain_set = Object.fromEntries(
            Object.entries(_chains).filter(([, v]) => v.id == route.query.chain),
          )
          const __desired_chain_name = Object.keys(__desired_chain_set)[0]
          const __desired_chain = __desired_chain_set[__desired_chain_name]
          __desired_chain["name"] = __desired_chain_name
          __desired_chain["id"] = route.query.chain

          selectedChain.value = new_chains[0]
          if (selectedChain.value.id != __desired_chain.id) {
            const success = await switchChain(__desired_chain.id)
            const toast = useToast()
            if (success) {
              selectedChain.value = __desired_chain
              toast.info(`Switched chain to: ${__desired_chain.label}`)
            } else {
              toast.error(`Could not switch to desired chain: ${__desired_chain.label}`)
            }
          } else {
            selectedChain.value = __desired_chain
          }
        } else {
          selectedChain.value = {}
        }
      }

      if (new_label != prev_label || new_chains != prev_chains || new_accounts != prev_accounts) {
        if (new_accounts?.length > 0) {
          console.log("account changed")
          userAddress.value = Web3.utils.toChecksumAddress(new_accounts[0].address)
          await updateUserBalance()
        } else {
          console.log("account disconnected")
          userAddress.value = "0x0000000000000000000000000000000000000000"
        }
      }
    } else {
      selectedChain.value = {}
      userAddress.value = "0x0000000000000000000000000000000000000000"
    }
  }

  // TODO: this might be split into processUser where we call in switch chain
  const processWallet = async function (wallets) {
    try {
      if (wallets.length > 0) {
        // const oldWallet = selectedWallet
        const newWallet = wallets[0]
        console.log("connected")
        if (
          selectedWallet.value?.label != newWallet.label ||
          selectedWallet.value?.chains[0].id != newWallet.chains[0].id ||
          selectedWallet.value?.accounts[0].address != newWallet.accounts[0].address
        ) {
          console.log("reconnected")
          selectedWallet.value = newWallet
        }
      } else {
        console.log("disconnected")
        selectedWallet.value = { chains: [], label: undefined, accounts: [] }
      }
    } catch (err) {
      console.log(err)
      isConnecting.value = false
      throw new Error("Could not set user")
    }
  }

  // internal functions
  const updateUserBalance = async function () {
    try {
      await timeout(300)
      if (isConnected.value) {
        const w3 = new Web3(selectedWallet.value.provider)
        userBalance.value = BN(await w3.eth.getBalance(userAddress.value))
      } else {
        userBalance.value = BN(0)
      }
    } catch (err) {
      console.log(err)
      isConnecting.value = false
      throw new Error("Could not update user balance")
    }
  }

  const switchChain = async function (id) {
    try {
      isConnecting.value = true
      if (selectedWallet.value) {
        const success = await onboard.setChain({
          chainId: id,
        })
        if (success) {
          isConnecting.value = false
          return success
        }
      }
      isConnecting.value = false
      return false
    } catch (err) {
      isConnecting.value = false
      console.log(err)
      return false
    }
  }

  watch(
    () => [selectedWallet.value.label, selectedWallet.value.chains, selectedWallet.value.accounts],
    processChain,
    { deep: true },
  )

  watch(userAddress, async () => {
    await updateUserBalance()
  })

  // Getters
  const isConnected = computed(() => {
    if (isConnecting.value) return false
    if (!userAddress.value) return false
    if (userAddress.value == "") return false
    return userAddress.value != "0x0000000000000000000000000000000000000000"
  })

  // Actions
  const __wallets = ref([])
  async function connect() {
    try {
      isConnecting.value = true
      const prevlen = __wallets.value.length || 0
      __wallets.value = await onboard.connectWallet()
      isConnecting.value = false
      return __wallets.value.length == prevlen + 1
    } catch (err) {
      isConnecting.value = false
      console.log(err)
      return false
    }
  }

  async function disconnect() {
    try {
      const prevlen = __wallets.value.length || 0
      const [primaryWallet] = onboard.state.get().wallets
      __wallets.value = await onboard.disconnectWallet({
        label: primaryWallet.label,
      })
      return __wallets.value.length == prevlen - 1
    } catch (err) {
      isConnecting.value = false
      console.log(err)
      return false
    }
  }

  return {
    userAddress,
    userBalance,
    selectedChain,
    selectedWallet,
    isConnecting,
    isConnected,
    connect,
    disconnect,
  }
})

export const chains = _chains
export const chains_not_ready = _chains_not_ready
export const chains_default = _chains_default
