<template>
  <vue-progress-bar />
  <Transition name="loader" mode="out-in">
    <loader v-if="!domIsReady" />
  </Transition>
  <router-view />
</template>

<script setup>
import { onMounted, ref } from "vue"
import timeout from "@/common/timeout"

var domIsReady = ref(false)

onMounted(() => {
  document.onreadystatechange = async () => {
    if (document.readyState == "complete") {
      await timeout(1000)
      domIsReady.value = true
    }
  }
})
</script>

<script>
// The following code block makes every page show loadingBar.
export default {
  created() {
    // [App.vue specific] When App.vue is first loaded start the progress bar
    this.$Progress.start() // hook the progress bar to start before we move router-view
    this.$router.beforeEach((to, from, next) => {
      // does the page we want to go to have a meta.progress object
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress
        // parse meta tags
        this.$Progress.parseMeta(meta)
      }
      // start the progress bar
      this.$Progress.start()
      // continue to the next page
      next()
    })
    // hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach(() => {
      //
      // finish the progress bar
      this.$Progress.finish()
    })
  },
}
</script>

<style>
#app,
.container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  min-height: 100vh;
  min-width: 100vw;
}
</style>
