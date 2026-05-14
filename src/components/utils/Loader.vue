<template>
  <div class="container loader">
    <loading-svg width="100px" maxWidth="150px" height="50px" />
  </div>
</template>

<style scoped>
.loader {
  background: #000;
  position: absolute;
  top: 0;
  max-width: 100vw;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#app {
  position: relative;
}
</style>
