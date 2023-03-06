import { postRequest, getRequest, patchRequest, deleteRequest } from "./helpers"

export async function postAlbums(data: { name: string; image?: File }) {
  const response = await postRequest("albums", data)
  return response
}

export async function getAlbums(
  query:
    | {
        name?: string
        exact?: boolean
        limit?: number | string
      }
    | undefined
) {
  const response = await getRequest("albums", query)
  return response
}

export async function patchAlbums(
  id: string,
  data: { name?: string; image?: File }
) {
  const response = await patchRequest("albums", id, data)
  return response
}

export async function deleteAlbums(id: string) {
  const response = await deleteRequest("albums", id)
  return response
}
