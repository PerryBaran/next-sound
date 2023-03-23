import Cookies from "js-cookie"
import { instance, config } from "./axios"
import createForm from "./createForm"

type Model = "users" | "users/login" | "users/signup" | "albums" | "songs"

function error(err: any | { response: { data: { message: string } } }) {
  if (err.response?.data?.message) {
    throw new Error(err.response.data.message)
  }
  throw new Error("Unexpected Error")
}

export async function postRequest(model: Model, data: any) {
  const formattedData = createForm(model, data)

  try {
    const response = await instance.post(`/${model}`, formattedData, config())
    return response.data
  } catch (err: any | { response: { data: { message: string } } }) {
    error(err)
  }
}

export async function getRequest(
  model: Model,
  query?: {
      name?: string
      exact?: boolean
      limit?: number
    }
) {
  let endpoint = `/${model}`
  const queryArray = []
  if (query) {
    if (query.name) {
      queryArray.push(`name=${query.name}`)
      if (query.exact) {
        queryArray.push("exact=true")
      }
    }
    if (query.limit) {
      queryArray.push(`limit=${query.limit}`)
    }
    if (queryArray.length > 0) {
      const query = queryArray.join("&")
      endpoint = `${endpoint}?${query}`
    }
  }

  try {
    const response = await instance.get(endpoint, config())
    return response.data
  } catch (err: any | { response: { data: { message: string } } }) {
    error(err)
  }
}

export async function getByIdRequest(model: Model, id: string) {
  try {
    const response = await instance.get(`/${model}/${id}`, config())
    return response.data
  } catch (err: any | { response: { data: { message: string } } }) {
    error(err)
  }
}

export async function patchRequest(model: Model, id: string, data: any) {
  const formattedData = createForm(model, data)

  try {
    const response = await instance.patch(`/${model}/${id}`, formattedData, config())
    return response.data
  } catch (err: any | { response: { data: { message: string } } }) {
    error(err)
  }
}

export async function deleteRequest(model: Model, id: string) {
  try {
    const response = await instance.delete(`/${model}/${id}`, config())
    return response.data
  } catch (err: any | { response: { data: { message: string } } }) {
    error(err)
  }
}
