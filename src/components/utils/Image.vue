<template>
  <img
    class="image"
    :style="{
      width: width,
      height: height,
      padding: padding,
      maxWidth: maxWidth,
      maxHeight: maxHeight,
      cursor: cursor,
    }"
    :src="`assets/${src}`"
    :alt="alt ? alt : 'icon'"
  />
</template>

<script setup>
const props = defineProps({
  src: String,
  width: String,
  height: String,
  maxWidth: String,
  maxHeight: String,
  padding: String,
  alt: String,
  asBackground: Boolean,
  cursor: String,
})
const position = props.asBackground ? "absolute" : "relative"
</script>

<style scoped>
.image {
  position: v-bind(position);
  object-fit: contain;
  width: 100;
  height: auto;
}
</style>
