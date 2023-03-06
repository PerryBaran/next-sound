"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { getByIdRequestSWR } from "@/requests/helpers"
import Alert from "@/components/alert/Alert"
import { useUserContext } from "@/context/UserContext"
import { postSongs } from "@/requests/songs"

interface Props {
  params: { albumId: string }
}

interface Songs {
  name: string
  audio?: File
  key: string
}

interface SWRRequest {
  Songs: Songs[]
}

export default function UploadSongs(props: Props) {
  const { albumId } = props.params
  const { data }: { data: SWRRequest } = useSWR(
    `/albums/${albumId}`,
    getByIdRequestSWR
  )
  const [songs, setSongs] = useState<Songs[]>([
    {
      name: "",
      audio: undefined,
      key: crypto.randomUUID()
    }
  ])
  const [alert, setAlert] = useState("")
  const router = useRouter()
  const {
    user: { name }
  } = useUserContext()
  const dragOver = useRef(0)

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

  const handleUpdateName = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const { value } = e.target

    setSongs((prev) => {
      const clone = [...prev]
      clone[i].name = value
      return clone
    })
  }

  const handleUpdateAudio = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const { files } = e.target

    if (!files) return

    setSongs((prev) => {
      const clone = [...prev]
      clone[i].audio = files[0]
      return clone
    })
  }

  const dragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOver.current = position
  }

  const dragEnd = (
    e: React.DragEvent<HTMLDivElement>,
    startPosition: number
  ) => {
    const endPosition = dragOver.current

    const _songs = [...songs]
    const songContent = _songs[startPosition]
    _songs.splice(startPosition, 1)
    _songs.splice(endPosition, 0, songContent)
    setSongs(_songs)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const startingPosition = data.Songs.length
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
      songsPromises.push(postSongs(data))
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
            <div
              key={song.key}
              draggable
              onDragEnter={(e) => dragEnter(e, i)}
              onDragEnd={(e) => dragEnd(e, i)}
            >
              <h3>Song {i + 1}</h3>
              <label htmlFor={`name${i}`}>
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  id={`name${i}`}
                  onChange={(e) => handleUpdateName(e, i)}
                  value={song.name}
                />
              </label>
              <label htmlFor={`audio${i}`}>
                <span>Audio</span>
                <input
                  type="file"
                  name="audio"
                  id={`audio${i}`}
                  onChange={(e) => handleUpdateAudio(e, i)}
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
