import Cookie from 'js-cookie'
import axios from 'axios'

const instance = axios.create({
  withCredentials: true,
  baseURL: 'https://soundcloud-clone-api.onrender.com'
})

function config() {
  return {
    headers: {
      userToken: Cookie.get('userToken')
    }
  }
}

type Model = 'users' | 'users/login' | 'users/signup' | 'albums' | 'string'

function createForm(model: string, data: any) {
  const formData = new FormData()
  switch (model) {
    case 'songs': {
      if (data.name) {
        formData.append('name', data.name)
      }
      if (data.audio) {
        formData.append('audio', data.audio)
      }
      if (data.position !== undefined) {
        formData.append('position', data.position)
      }
      if (data.AlbumId) {
        formData.append('AlbumId', data.AlbumId)
      }
      break
    }
    case 'albums': {
      if (data.name) {
        formData.append('name', data.name)
      }
      if (data.image) {
        formData.append('image', data.image)
      }
      break
    }
    default: {
      return data
    }
  }
  return formData
}

function error(err: any | { response: { data: { message: string } } }) {
  if (err.response?.data?.message) {
    throw new Error(err.response.data.message)
  }
  throw new Error('Unexpected Error')
}

export async function postRequest(model: Model, data: any) {
  const formData = createForm(model, data)

  try {
    const response = await instance.post(`/${model}`, formData, config())
    return response.data
  } catch (err: any | { response: { data: { message: string } } }) {
    error(err)
  }
}

export async function getRequest(
  model: Model,
  query:
    | {
        name?: string
        exact?: boolean
        limit?: number | string
      }
    | undefined
) {
  let endpoint = `/${model}`
  const queryArray = []
  if (query) {
    if (query.name) {
      queryArray.push(`name=${query.name}`)
      if (query.exact) {
        queryArray.push('exact=true')
      }
    }
    if (query.limit) {
      queryArray.push(`limit=${query.limit}`)
    }
    if (queryArray.length > 0) {
      const query = queryArray.join('&')
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

export async function getByIdRequest(model: Model, id: string | number) {
  try {
    const response = await instance.get(`/${model}/${id}`, config())
    return response.data
  } catch (err: any | { response: { data: { message: string } } }) {
    error(err)
  }
}

export async function patchRequest(
  model: Model,
  id: string | number,
  data: any
) {
  const formData = createForm(model, data)

  try {
    const response = await instance.patch(`/${model}/${id}`, formData, config())
    return response.data
  } catch (err: any | { response: { data: { message: string } } }) {
    error(err)
  }
}

export async function deleteRequest(model: Model, id: string | number) {
  try {
    const response = await instance.delete(`/${model}/${id}`, config())
    return response.data
  } catch (err: any | { response: { data: { message: string } } }) {
    error(err)
  }
}
