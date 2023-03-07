"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { getByIdRequestSWR } from "@/requests/helpers"
import Alert from "@/components/alert/Alert"
import { patchAlbums, deleteAlbums } from "@/requests/albums"
import { patchSongs, deleteSongs, postSongs } from "@/requests/songs"
import { useUserContext } from "@/context/UserContext"
import css from "./editAlbum.module.css"

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
  delete?: boolean
  position?: number
  id?: string
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
  const [placeholder, setPlaceholders] = useState(data)
  const [album, setAlbum] = useState<Album>({
    name: "",
    image: undefined
  })
  const [songs, setSongs] = useState<Songs[]>([])
  const [alert, setAlert] = useState("")
  const dragOver = useRef(0)
  const router = useRouter()
  const {
    user: { name }
  } = useUserContext()

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

    const _placeholders = { ...placeholder }
    const _placeholdersSongs = _placeholders.Songs
    const _placeholderContent = _placeholdersSongs[startPosition]
    _placeholdersSongs.splice(startPosition, 1)
    _placeholdersSongs.splice(endPosition, 0, _placeholderContent)
    setPlaceholders(_placeholders)
  }

  const addSong = () => {
    setSongs((prev) => [...prev, {
      name: "",
      audio: undefined,
      key: crypto.randomUUID()
    }])

    setPlaceholders((prev) => {
      const clone = {...prev}
      clone.Songs.push({
        name: "",
        audio: undefined,
        key: crypto.randomUUID()
      })
      return clone
    })
  }

  const removeSong = (i: number) => {
    setSongs((prev) => {
      const clone = [...prev]
      clone.splice(i, 1)
      return clone
    })

    setPlaceholders((prev) => {
      const clone = {...prev}
      clone.Songs.splice(i, 1)
      return clone
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const albumPromise = []

    if (album.name || album.image) {
      const data = {
        name: album.name || undefined,
        image: album.image || undefined
      }
      albumPromise.push(data)
    }

    const { length } = songs;

    let position = 0
    let songDeletePromises = []
    let songPatchPromises = []
    let songPostPromises = []
    for (let i = 0; i < length; i++) {
      const song = songs[i]
      if (song.id) {
        if (song.delete) {
          songDeletePromises.push(song.id)
        } else if (song.name || song.audio || song.position !== position) {
          const data = {
            name: song.name !== "" ? song.name : undefined,
            audio: song.audio || undefined,
            position: song.position !== position ? song.position : undefined
          }
          songPatchPromises.push({
            id: song.id,
            data
          })
          position++
        }
      } else {
        if (!song.name) {
          setAlert("All songs must contain a name")
          return
        }
        if (!song.audio) {
          setAlert("All songs must contain audio")
          return
        }
        const data = {
          name: song.name,
          audio: song.audio,
          position,
        }
        songPostPromises.push(data)
        position++
      }
    }

    try {
      await Promise.all([
        ...albumPromise.map((album) => patchAlbums(albumId, album)),
        ...songDeletePromises.map((id) => deleteSongs(id)),
        ...songPatchPromises.map((song) => patchSongs(song.id, song.data)),
        ...songPostPromises.map((data) => postSongs({...data, AlbumId: albumId}))
      ])

      router.push(`profile/${name}`)
    } catch (err: any | Error) {
      setAlert(err?.message || "Unexpected Error")
    }
  }

  const handleDeleteAlbum = async () => {
    try {
      await deleteAlbums(albumId)

      router.push(`profile/${name}`)
    } catch (err: any | Error) {
      setAlert(err?.message || "Unexpected Error")
    }
  }

  useEffect(() => {
    if (data && data.Songs) {
      setSongs(() => {
        return data.Songs.map((song, i) => {
          return {
            name: "",
            audio: undefined,
            delete: false,
            id: song.id,
            position: i,
            key: crypto.randomUUID(),
          }
        })
      })
      setPlaceholders(data)
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
              placeholder={placeholder?.name}
              onChange={handleAlbumNameChange}
            />
          </label>
          <label htmlFor="art">
            <span>Cover Art</span>
            <input type="file" id="art" onChange={handleAlbumImageChange} />
          </label>
        </div>
        <div>
          <h3>Edit Songs</h3>
          {songs.map((song, i) => {
            return (
              <div
                key={song.key}
                draggable
                onDragEnter={(e) => dragEnter(e, i)}
                onDragEnd={(e) => dragEnd(e, i)}
                className={css.song}
              >
                <h4>Song {i + 1}</h4>
                <label htmlFor={`song-name${i}`}>
                  <span>Song Name</span>
                  <input
                    type="text"
                    id={`song-name${i}`}
                    name="name"
                    value={song.name}
                    placeholder={placeholder?.Songs[i]?.name}
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
                {!song.id ? (
                  <button type="button" onClick={() => removeSong(i)} className={css["delete-song"]}>
                    x
                  </button>
                ) : (
                  <label htmlFor={`delete-song${i}`} className={css["delete-song"]}>
                    <span className="upload-info">x</span>
                    <input
                      type="checkbox"
                      id={`delete-song${i}`}
                      name="delete"
                      checked={song.delete}
                      onChange={(e) => handleSongDelete(e, i)}
                    />
                  </label>
                )}
              </div>
            )
          })}
          <button type="button" onClick={addSong}>
            +
          </button>
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={handleDeleteAlbum}>Delete Album</button>
        <button type="button">Cancel</button>
      </form>
    </div>
  )
}
