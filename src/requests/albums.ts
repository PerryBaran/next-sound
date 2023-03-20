import {
  postRequest,
  getRequest,
  patchRequest,
  deleteRequest,
  getByIdRequest
} from "./helpers"

export async function postAlbums(data: { name: string; image?: File }) {
  const response = await postRequest("albums", data)
  return response
}

export async function getAlbums(query?: {
  name?: string
  exact?: boolean
  limit?: number
}) {
  const response = await getRequest("albums", query)
  return response
}

export async function getAlbumById(id: string) {
  const response = await getByIdRequest("albums", id)
  return response
}

export async function patchAlbum(
  id: string,
  data: { name?: string; image?: File }
) {
  const response = await patchRequest("albums", id, data)
  return response
}

export async function deleteAlbum(id: string) {
  const response = await deleteRequest("albums", id)
  return response
}
