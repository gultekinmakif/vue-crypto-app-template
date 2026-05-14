import "@/style.css"
import "nprogress/nprogress.css"

// App
import { createApp } from "vue"
import App from "./App.vue"
const app = createApp(App)

// Components
import loader from "@/components/utils/Loader.vue"
import loadingSvg from "@/components/utils/Loading.svg.vue"
import buttonVue from "@/components/utils/Button.vue"
import imageVue from "@/components/utils/Image.vue"
app.component("loader", loader)
app.component("loading-svg", loadingSvg)
app.component("button-vue", buttonVue)
app.component("image-vue", imageVue)

// router
import router from "./router"
app.use(router)

// Store
import { createPinia } from "pinia"
const pinia = createPinia()
app.use(pinia)

// Toast
import Toast from "vue-toastification"
import { useToast } from "vue-toastification"
import "vue-toastification/dist/index.css"
app.use(Toast, {
  transition: "Vue-Toastification__fade",
  position: "bottom-right",
  maxToasts: 10,
  timeout: 3000,
  newestOnTop: true,
  closeOnClick: false,
  showCloseButtonOnHover: true,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  draggable: true,
  draggablePercent: 0.25,
})

// error handler
app.config.errorHandler = function (err) {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in. Only available in 2.2.0+
  try {
    const toast = useToast()
    toast.error(`Error: something went wrong :(`)
    console.log(err)
  } catch (err) {
    console.log(err)
  }
}

app.mount("#app")

export default app
