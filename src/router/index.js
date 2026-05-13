import { createRouter, createWebHistory } from "vue-router"

import { chains, chains_default, chains_not_ready } from "@/stores/walletStore"
import { useToast } from "vue-toastification"

const setchainquery = (to) => {
  if (!Object.prototype.hasOwnProperty.call(to.query, "chain")) {
    to.query.chain = chains[chains_default].id
    return { name: to.name, query: to.query }
  }

  if (
    Object.values(chains)
      .map((x) => x.id)
      .includes(to.query.chain)
  ) {
    // resulting dict will only include 1 chain. web3-onboard does not allow duplicate keys
    const selected_chains = Object.fromEntries(
      Object.entries(chains).filter(([, v]) => v.id == to.query.chain),
    )
    const name = Object.keys(selected_chains)[0]
    const selected_chain = selected_chains[name]

    if (chains_not_ready.includes(to.query.chain) || chains_not_ready.includes(name)) {
      const toast = useToast()
      toast.error(`Chain is not supported yet: ${selected_chain.label}`)
      to.query.chain = chains[chains_default].id
      return { query: to.query }
    }

    // add more handlers about chains here

    // add more handlers about chains here
  } else {
    const toast = useToast()
    toast.error(`Unknown chain: ${to.query.chain}. Switching to ${chains_default}.`)
    to.query.chain = chains[chains_default].id
    return { query: to.query }
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "",
      name: "main",
      component: () => import("@/views/Main.vue"),
      children: [
        {
          path: "",
          name: "home",
          component: () => import("@/components/HelloWorld.vue"),
        },
        {
          path: "/momo",
          name: "momo",
          component: () => import("@/components/utils/Loader.vue"),
        },
        {
          path: "/:pathMatch(.*)*",
          name: "NotFound",
          redirect: { name: "home", params: {} },
        },
      ],
    },
  ],
})

router.beforeEach(setchainquery)

export default router
