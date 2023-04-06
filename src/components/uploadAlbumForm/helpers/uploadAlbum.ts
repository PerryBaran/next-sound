import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"
import { postAlbums } from "../../../requests/albums"
import { postSongs } from "../../../requests/songs"

interface Album {
  name: string
  image?: File
}

interface Songs {
  name: string
  audio?: File
}

export default async function uploadAlbum(
  album: Album,
  songs: Songs[],
  setAlert: React.Dispatch<React.SetStateAction<string>>,
  router: AppRouterInstance,
  name: string
) {
  if (!album.name) {
    setAlert("Must provide a name")
    return
  }

  const { length } = songs
  if (length === 0) {
    setAlert("album must contain atleast one song")
    return
  }

  const songPromises = []

  for (let i = 0; i < length; i++) {
    const { name, audio } = songs[i]
    if (!name) {
      setAlert("All songs must contain a name")
      return
    }
    if (!audio) {
      setAlert("All songs must contain audio")
      return
    }
    const data = {
      name,
      audio,
      position: i
    }
    songPromises.push(data)
  }

  try {
    const { id } = await postAlbums(album)
    await Promise.all(
      songPromises.map((song) => {
        return postSongs({ ...song, AlbumId: id })
      })
    )
    router.push(`profile/${name}`)
  } catch (err: any | Error) {
    setAlert(err?.message || "Unexpected Error")
  }
}
