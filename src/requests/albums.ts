import { postRequest, getRequest } from "./helpers"

export async function postAlbums(data: {
  name: string
  image?: File
}) {
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
