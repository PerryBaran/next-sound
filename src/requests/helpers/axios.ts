import axios from "axios"
import Cookies from "js-cookie"

export const instance = axios.create({
  withCredentials: true,
  baseURL: "https://soundcloud-clone-api-production.up.railway.app/"
})

export function config() {
  return {
    headers: {
      userToken: Cookies.get("userToken")
    }
  }
}
