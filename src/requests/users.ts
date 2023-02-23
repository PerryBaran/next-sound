import { postRequest, getRequest, getByIdRequest } from './helpers'
import Cookies from 'js-cookie'

export async function getUsers(
  query:
    | {
        name?: string
        exact?: boolean
        limit?: number | string
      }
    | undefined
) {
  const response = await getRequest('users', query)
  return response
}



export async function login(data: { email: string; password: string }) {
  const response = await postRequest('users/login', data)
  Cookies.set('userToken', response.userToken, { expires: 5 })
  return response
}

export async function getUserById(id: string | number) {
  const response = await getByIdRequest('users', id)
  return response
}
