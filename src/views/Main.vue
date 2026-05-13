<template>
  <div class="container desktop-view">
    <div class="container main-container">
      <router-view v-slot="{ Component, route }">
        <Transition name="fadein" mode="out-in" class="scrollable" appear>
          <component :is="Component" class="route-component container" :key="route.name" />
        </Transition>
      </router-view>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.desktop-view {
  position: relative;
  min-height: 100vh;
  min-width: 100vw;
}

.main-container {
  position: absolute;
}

@media screen and (max-width: 600px) {
  .main-container {
  }
}
</style>

<style>
.route-component {
  margin: 0;
  padding: var(--max-pad) var(--norm-pad);
  gap: var(--norm-pad);
  min-height: 100vh;
}
</style>
