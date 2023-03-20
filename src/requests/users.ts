import {
  postRequest,
  getRequest,
  getByIdRequest,
  patchRequest,
  deleteRequest
} from "./helpers"
import Cookies from "js-cookie"

export async function login(data: { email: string; password: string }) {
  const response = await postRequest("users/login", data)
  Cookies.set("userToken", response.userToken, { expires: 5 })
  return response
}

export async function signup(data: {
  name: string
  email: string
  password: string
}) {
  const response = await postRequest("users/signup", data)
  Cookies.set("userToken", response.userToken, { expires: 5 })
  return response
}

export async function getUsers(query?: {
  name?: string
  exact?: boolean
  limit?: number | string
}) {
  const response = await getRequest("users", query)
  return response
}

export async function getUserById(id: string) {
  const response = await getByIdRequest("users", id)
  return response
}

export async function patchUser(
  id: string,
  data: {
    name?: string
    email?: string
    password?: string
  }
) {
  const response = await patchRequest("users", id, data)
  return response
}

export async function deleteUser(id: string, password: string) {
  const response = await deleteRequest("users", `${id}/${password}`)
  return response
}
