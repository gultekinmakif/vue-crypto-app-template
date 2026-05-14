<template>
  <Transition name="loader" mode="out-in">
    <loader v-if="!domIsReady" />
  </Transition>
  <router-view />
</template>

<script setup>
import { onMounted, ref } from "vue"

const domIsReady = ref(false)

onMounted(() => {
  if (document.readyState == "complete") {
    domIsReady.value = true
    return
  }
  document.onreadystatechange = () => {
    if (document.readyState == "complete") domIsReady.value = true
  }
})
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
