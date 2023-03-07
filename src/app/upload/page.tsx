"use client"

import Alert from "@/components/alert/Alert"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { postAlbums } from "@/requests/albums"
import { postSongs } from "@/requests/songs"
import { useUserContext } from "@/context/UserContext"

interface Album {
  name: string
  image?: File
}

interface Songs {
  name: string
  audio?: File
  key: string
}

export default function UploadAlbum() {
  const [album, setAlbum] = useState<Album>({
    name: "",
    image: undefined
  })
  const [songs, setSongs] = useState<Songs[]>([
    {
      name: "",
      audio: undefined,
      key: crypto.randomUUID()
    }
  ])
  const [alert, setAlert] = useState("")
  const router = useRouter()
  const dragOver = useRef(0)
  const {
    user: { name }
  } = useUserContext()

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbum(prev => {
      return {...prev, name: e.target.value}
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (!files) return

    setAlbum(prev => {
      return {...prev, image: files[0]}
    })
  }

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
        position: i,
      }
      songPromises.push(data)
    }

    try {
      const { id } = await postAlbums(album)
      await Promise.all(songPromises.map((data) => {
        return postSongs({...data, AlbumId: id})
      }))
      router.push(`profile/${name}`)
    } catch (err: any | Error) {
      setAlert(err?.message || "Unexpected Error")
    }
  }

  return (
    <div>
      <Alert message={alert} />
      <form onSubmit={handleSubmit}>
        <h2>Create Album</h2>
        <label htmlFor="name">
          <span>Name</span>
          <input
            type="text"
            name="name"
            id="name"
            value={album.name}
            onChange={handleNameChange}
          />
        </label>
        <label htmlFor="image">
          <span>Cover Art</span>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleImageChange}
          />
        </label>
        <button type="submit">Create Album</button>
        <div>
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
          <button type="submit">Upload Album</button>  
        </div>
      </form>
    </div>
  )
}
