import { postRequest, getRequest, patchRequest, deleteRequest } from "./helpers"

export async function postSongs(data: {
  name: string
  audio: File
  position: number
  AlbumId: string
}) {
  const response = await postRequest("songs", data)
}

export async function getSongs(
  query:
    | {
        name?: string
        exact?: boolean
        limit?: number | string
      }
    | undefined
) {
  const response = await getRequest("songs", query)
  return response
}

export async function patchSong(
  id: string,
  data: { name?: string; audio?: File; position?: number }
) {
  const response = await patchRequest("songs", id, data)
  return response
}

export async function deleteSong(id: string) {
  const response = await deleteRequest("songs", id)
  return response
}
