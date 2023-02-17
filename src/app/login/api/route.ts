import axios from 'axios'

export default async function login(data: {email: string, password: string}) {
  try {
    const response: { data: { id: string, name: string }} = await axios.post('https://soundcloud-clone-api.onrender.com/users/login', data);
    return response.data;
  } catch (err: any | { response: { data: { message: string }}}) {
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message)
    }
    throw new Error('Unexpected Error')
  }
}