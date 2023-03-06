"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import Alert from "@/components/alert/Alert"
import { useUserContext } from "@/context/UserContext"

interface Props {
  params: { albumId: string }
}

interface Songs {
  name: string
  audio?: File
  key: string
}

export default function UploadSongs(props: Props) {
  const { albumId } = props.params
  const [songs, setSongs] = useState<Songs[]>([
    {
      name: "",
      audio: undefined,
      key: crypto.randomUUID()
    }
  ])
  const [alert, setAlert] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const albumLength = searchParams.get("albumLength")
  const startingPosition = albumLength === null ? 0 : Number(albumLength)
  const {
    user: { name }
  } = useUserContext()

  const addSong = () => {
    const song = {
      name: "",
      audio: undefined,
      key: crypto.randomUUID()
    }

    setSongs((prev) => [...prev, song])
  }

  const removeSong = (i: number) => {
    setSongs((prev) => {
      const clone = [...prev]
      clone.splice(i, 1)
      return clone
    })
  }

  const handleUpdateSong = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const { value, files } = e.target

    setSongs((prev) => {
      const clone = [...prev]
      if (value) {
        clone[i].name = value
      }
      if (files) {
        clone[i].audio = files[0]
      }
      return clone
    })
  }

  const handleSubmit = async () => {
    const { length } = songs
    const songsPromises = []
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
        position: startingPosition + i,
        AlbumId: albumId
      }
      songsPromises.push(data)
    }

    try {
      await Promise.all(songsPromises)

      router.push(`profile/${name}`)
    } catch (err: any | Error) {
      setAlert(err?.message || "Unexpected Error")
    }
  }

  return (
    <div>
      <Alert message={alert} />
      <form onSubmit={handleSubmit}>
        <h2>Upload Songs</h2>
        {songs.map((song, i) => {
          return (
            <div key={song.key}>
              <h3>Song {i + 1}</h3>
              <label htmlFor={`name${i}`}>
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  id={`name${i}`}
                  onChange={(e) => handleUpdateSong(e, i)}
                  value={song.name}
                />
              </label>
              <label htmlFor={`audio${i}`}>
                <span>Audio</span>
                <input
                  type="file"
                  name="audio"
                  id={`audio${i}`}
                  onChange={(e) => handleUpdateSong(e, i)}
                />
              </label>
              <button type="button" onClick={() => removeSong(i)}>
                x
              </button>
            </div>
          )
        })}
        <button type="button" onClick={addSong}>
          +
        </button>
        <button type="submit">Add Songs</button>
      </form>
    </div>
  )
}
