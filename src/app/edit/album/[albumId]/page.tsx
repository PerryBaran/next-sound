"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { getByIdRequestSWR } from "@/requests/helpers"
import Alert from "@/components/alert/Alert"

interface Props {
  params: { albumId: string }
}

interface Album {
  name: string
  image: File | undefined
}

interface Songs {
  name: string
  audio?: File
  delete: boolean
  id: string
  key: string
}

interface SWRRequest {
  name: string
  url: string | null
  id: string
  Songs: Songs[]
}

export default function EditAlbum(props: Props) {
  const { albumId } = props.params
  const { data }: { data: SWRRequest } = useSWR(
    `/albums/${albumId}`,
    getByIdRequestSWR
  )

  const [album, setAlbum] = useState<Album>({
    name: "",
    image: undefined
  })
  const [songs, setSongs] = useState<Songs[]>([])
  const [alert, setAlert] = useState("")

  const handleAlbumNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    setAlbum((prev) => {
      const clone = { ...prev }
      clone.name = value
      return clone
    })
  }

  const handleAlbumImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target

    if (!files) return

    setAlbum((prev) => {
      const clone = { ...prev }
      clone.image = files[0]
      return clone
    })
  }

  const handleSongNameChange = (
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

  const handleSongAudioChange = (
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

  const handleSongDelete = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const { checked } = e.target
    setSongs((prev) => {
      const clone = [...prev]
      clone[i].delete = checked
      return clone
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log(album, songs)
  }

  useEffect(() => {
    if (data && data.Songs) {
      setSongs(() => {
        return data.Songs.map((song) => {
          return {
            name: "",
            audio: undefined,
            delete: false,
            id: song.id,
            key: crypto.randomUUID()
          }
        })
      })
    }
  }, [data])

  return (
    <div>
      <Alert message={alert} />
      <form onSubmit={handleSubmit}>
        <h2>Edit Album</h2>
        <div>
          <label htmlFor="album-name">
            <span>Album Name</span>
            <input
              type="text"
              id="album-name"
              value={album.name}
              placeholder={data?.name}
              onChange={handleAlbumNameChange}
            />
          </label>
          <label htmlFor="art">
            <span>Cover Art</span>
            <input type="file" id="art" onChange={handleAlbumImageChange} />
          </label>
        </div>
        <h3>Edit Songs</h3>
        {songs.map((song, i) => {
          return (
            <div key={song.key}>
              <h4>Song {i + 1}</h4>
              <label htmlFor={`song-name${i}`}>
                <span>Song Name</span>
                <input
                  type="text"
                  id={`song-name${i}`}
                  name="name"
                  value={song.name}
                  placeholder={data?.Songs[i]?.name}
                  onChange={(e) => handleSongNameChange(e, i)}
                />
              </label>
              <label htmlFor={`song-audio${i}`}>
                <span className="upload-info">Audio</span>
                <input
                  type="file"
                  id={`song-audio${i}`}
                  onChange={(e) => handleSongAudioChange(e, i)}
                />
              </label>
              <label htmlFor={`delete-song${i}`}>
                <span className="upload-info">Delete Song?</span>
                <input
                  type="checkbox"
                  id={`delete-song${i}`}
                  name="delete"
                  checked={song.delete}
                  onChange={(e) => handleSongDelete(e, i)}
                />
              </label>
            </div>
          )
        })}
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
