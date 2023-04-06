import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"
import { patchAlbum } from "../../../requests/albums"
import { patchSong, deleteSong, postSongs } from "../../../requests/songs"

interface Data {
  name: string
  id: string
  Songs?: {
    name: string
    position: number
    id: string
  }[]
  albumId: string
}

interface Album {
  name: string
  image?: File
}

interface Songs {
  current: {
    name: string
    audio?: File
    delete?: boolean
  }
  original?: {
    name: string
    position: number
    id: string
  }
  key: string
}

export default async function handleSubmit(
  data: Data,
  album: Album,
  songs: Songs[],
  setAlert: React.Dispatch<React.SetStateAction<string>>,
  router: AppRouterInstance,
  name: string
) {
  const albumPromise = []

  if (!album.name) {
    setAlert("Album must have a name")
    return
  }

  if (album.name !== data.name || album.image) {
    albumPromise.push({
      name: album.name !== data.name ? album.name : undefined,
      image: album.image || undefined
    })
  }

  const { length } = songs
  let position = 0
  let songDeletePromises = []
  let songPatchPromises = []
  let songPostPromises = []

  for (let i = 0; i < length; i++) {
    const song = songs[i]
    if (song.original) {
      if (song.current.delete) {
        songDeletePromises.push(song.original.id)
      } else if (!song.current.name) {
        setAlert("All songs must have a name")
        return
      } else if (
        song.current.name !== song.original.name ||
        song.current.audio ||
        song.original.position !== position
      ) {
        const data = {
          name:
            song.current.name !== song.original.name
              ? song.current.name
              : undefined,
          audio: song.current.audio || undefined,
          position: song.original.position !== position ? position : undefined
        }

        songPatchPromises.push({
          id: song.original.id,
          data
        })
      }
    } else {
      if (!song.current.name) {
        setAlert("All songs must have a name")
        return
      }

      if (!song.current.audio) {
        setAlert("All songs must have audio")
        return
      }

      const data = {
        name: song.current.name,
        audio: song.current.audio,
        position
      }

      songPostPromises.push(data)
    }

    if (!song.current.delete) {
      position++
    }
  }

  try {
    await Promise.all([
      ...albumPromise.map((album) => patchAlbum(data.albumId, album)),
      ...songDeletePromises.map((id) => deleteSong(id)),
      ...songPatchPromises.map((song) => patchSong(song.id, song.data)),
      ...songPostPromises.map((song) =>
        postSongs({ ...song, AlbumId: data.albumId })
      )
    ])

    router.push(`profile/${name}`)
  } catch (err: any | Error) {
    setAlert(err?.message || "Unexpected Error")
  }
}
