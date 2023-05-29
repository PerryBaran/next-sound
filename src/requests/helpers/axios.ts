import axios from "axios"
import Cookies from "js-cookie"

export const instance = axios.create({
  withCredentials: true,
  baseURL: "https://soundcloud-clone-api.onrender.com"
})

export function config() {
  return {
    headers: {
      userToken: Cookies.get("userToken")
    }
  }
}
