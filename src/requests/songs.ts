import { getRequest } from "./helpers"

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
