import axios from "axios"
import app from "../main" // import the instance

const instance = axios.create({
  baseURL: "/api",
})

instance.interceptors.request.use((config) => {
  app.config.globalProperties.$Progress.start() // for every request start the progress
  return config
})

instance.interceptors.response.use(
  (response) => {
    app.config.globalProperties.$Progress.finish() // finish when a response is received
    return response
  },
  (error) => {
    app.config.globalProperties.$Progress.fail() // finish when a response is received
    return error
  },
)

export default instance // export axios instance to be imported in your app
