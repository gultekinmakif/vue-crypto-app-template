<template>
  <button
    :class="{
      Button: true,
      large: props.large,
      hovered: forceHover,
      rounded: true,
      hoverable: !props.disabled,
      fontbold: props.bold,
    }"
    :style="{
      color: text_color,
      border: props.customBorder ?? (props.border ? `1px solid ${color}` : 'none'),
      width: props.stretch ? '100%' : props.width,
      borderRadius: props.customRadius,
      minWidth: props.minWidth,
      padding: props.padding,
      fontWeight: props.fontWeight,
    }"
    @click="
      () => {
        if (props.shouldConnect && !isConnected) handleConnection()
        else $emit('clicked')
      }
    "
    :disabled="props.disabled || isLoading"
  >
    <Transition name="fadein" mode="in-out" class="loading">
      <div class="loading-svg-wrapper" v-if="isLoading" key="loading">
        <loading-svg height="80%" :color="color.includes('purple') ? 'var(--color-white)' : null" />
      </div>
    </Transition>
    <Transition name="fadein" mode="in-out" appear>
      <div class="flex-row buttonInside" v-if="!isLoading" key="notloading">
        <image-vue
          v-if="props.icon != null || !isConnected"
          :src="icon"
          :width="iconWidth"
          :height="iconHeight"
          class="buttonIcon"
        />
        {{ pending ? "&nbsp;&nbsp;" : text }}
      </div>
    </Transition>
  </button>
</template>

<script setup>
import { computed } from "vue"
import { storeToRefs } from "pinia"
import { useWalletStore } from "@/stores/walletStore"
import { useToast } from "vue-toastification"
import timeout from "@/common/timeout"
const toast = useToast()

const props = defineProps({
  text: String,
  color: String,
  textColor: String,
  fill: Boolean,
  disabled: Boolean,
  stretch: Boolean,
  border: Boolean,
  customBorder: String,
  customRadius: String,
  width: String,
  minWidth: String,
  smallOnMobile: Boolean,
  disabledColor: String,
  hoverColor: String,
  large: Boolean,
  icon: String,
  pending: Boolean,
  padding: String,
  forceHover: Boolean,
  iconHeight: String,
  iconWidth: String,
  iconBorder: String,
  fontWeight: String,
  shouldConnect: Boolean,
  bold: Boolean,
})

const walletStore = useWalletStore()
const { connect } = walletStore
const { isConnected, isConnecting } = storeToRefs(walletStore)

// loading icon
const isLoading = computed(() => isConnecting.value || props.pending)

// text
const text = computed(() => {
  return props.shouldConnect && !isConnected.value ? "Connect wallet" : props.text
})

//icon
const icon = computed(() => {
  return props.shouldConnect && !isConnected.value ? "icons/wallet.svg" : props.icon
})

//color
const color = computed(() => {
  return props.shouldConnect && !isConnected.value
    ? "var(--color-dark-green)"
    : props.color
      ? props.color
      : "var(--color-purple)"
})

const text_color = computed(() => {
  return props.textColor ?? (props.fill ? "var(--color-text)" : color)
})
const button_color = computed(() => {
  return props.fill
    ? props.disabled && props.disabledColor
      ? props.disabledColor
      : color.value
    : "transparent"
})

const hover_color = computed(() => {
  return props.hoverColor ?? color.value
})

const handleConnection = async () => {
  try {
    await timeout(300)
    const success = await connect()
    if (!success) toast.error("Connection rejected.")
  } catch (error) {
    toast.error("Connection rejected.")
  }
}
</script>

<style scoped>
.Button {
  position: relative;
  padding: 12px 16px;
  cursor: pointer;
  background-color: v-bind(button_color);
  opacity: 90%;
  transition: all 0.3s;
  font-size: inherit;
  font-weight: inherit;
  margin: 0;
  height: 46px !important;
  min-height: 46px;
  max-height: 46px; /* need it for safari  */
}

.Button.hovered,
.Button:hover {
  opacity: 100%;
  background-color: v-bind(hover_color);
}

.Button:disabled,
.Button:disabled:hover {
  opacity: 0.5;
  cursor: not-allowed !important;
  background-color: v-bind(button_color);
}

.buttonInside {
  margin: 0;
  gap: 10px;
  padding: 0 var(--small-pad);
  align-items: center;
  font-weight: inherit;
}
.loading-svg-wrapper {
  padding: 0 var(--small-pad);
  top: 0;
}

.large {
  padding: 16px 32px;
  font-size: 20px;
}

.fontbold {
  font-weight: 700;
  font-size: 16px;
}

.loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  pointer-events: none;
}
.buttonIcon {
  border-radius: v-bind(iconBorder);
  width: auto;
}

@media screen and (max-width: 820px) {
  .small-on-mobile {
    padding: 7px 14px;
  }
}

@media screen and (max-width: 820px) {
  .buttonInside {
    gap: 12px;
  }
}
</style>
