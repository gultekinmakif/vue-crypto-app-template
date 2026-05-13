<template>
  <div class="container loader">
    <div class="futuristic">G E O D E</div>
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
.futuristic {
  text-shadow:
    0px 0px 6px #8761ffcc,
    0px 0px 30px #8761ff88;
  font-size: 40px;
  font-family: "Equinox";
  color: #8761ff;
  font-weight: 700;
}

#app {
  position: relative;
}
</style>
