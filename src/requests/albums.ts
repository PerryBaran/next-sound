import { getRequest } from './helpers'

export async function getAlbums(
  query:
    | {
        name?: string
        exact?: boolean
        limit?: number | string
      }
    | undefined
) {
  const response = await getRequest('albums', query)
  return response
}
