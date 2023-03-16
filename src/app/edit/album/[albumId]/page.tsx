"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { getAlbumById } from "@/requests/albums"
import Alert from "@/components/alert/Alert"
import { patchAlbum, deleteAlbum } from "@/requests/albums"
import { patchSong, deleteSong, postSongs } from "@/requests/songs"
import { useUserContext } from "@/context/UserContext"
import css from "./editAlbum.module.css"
import Confirm from "@/components/confirm/confirm"

interface Props {
  params: { albumId: string }
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

interface SWRRequest {
  name: string
  id: string
  Songs: {
    name: string
    position: number
    id: string
  }[]
}

export default function EditAlbum(props: Props) {
  const { albumId } = props.params
  const { data }: { data: SWRRequest } = useSWR(`${albumId}`, getAlbumById)
  const [album, setAlbum] = useState<Album>({
      name: ""
    })
  const [songs, setSongs] = useState<Songs[]>([])
  const [alert, setAlert] = useState("")
  const dragOver = useRef(0)
  const router = useRouter()
  const {
    user: { name }
  } = useUserContext()
  const [confirm, setConfirm] = useState("")

  const handleAlbumNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    setAlbum((prev) => {
      return { ...prev, name: value }
    })
  }

  const handleAlbumImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target

    if (!files) return

    setAlbum((prev) => {
      return { ...prev, image: files[0] }
    })
  }

  const handleSongNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    const { value } = e.target
    setSongs((prev) => {
      const clone = [...prev]
      clone[i].current.name = value
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
      clone[i].current.audio = files[0]
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
      clone[i].current.delete = checked
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

  const addSong = () => {
    setSongs((prev) => [
      ...prev,
      {
        current: {
          name: ""
        },
        key: crypto.randomUUID()
      }
    ])
  }

  const removeSong = (i: number) => {
    setSongs((prev) => {
      const clone = [...prev]
      clone.splice(i, 1)
      return clone
    })
  }

  const handleSubmit = async () => {
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
          setAlert("song must have a name")
          return
        } else if (
          (song.current.name !== song.original.name) || 
          (song.current.audio) || 
          (song.original.position !== position)) {
          const data = {
            name: song.current.name !== song.original.name ? song.current.name : undefined,
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
          setAlert("All songs must contain a name")
          return
        }

        if (!song.current.audio) {
          setAlert("All songs must contain audio")
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
        ...albumPromise.map((album) => patchAlbum(albumId, album)),
        ...songDeletePromises.map((id) => deleteSong(id)),
        ...songPatchPromises.map((song) => patchSong(song.id, song.data)),
        ...songPostPromises.map((data) =>
          postSongs({ ...data, AlbumId: albumId })
        )
      ])

      router.push(`profile/${name}`)
    } catch (err: any | Error) {
      setAlert(err?.message || "Unexpected Error")
    }
  }

  const handleDeleteAlbum = async () => {
    try {
      await deleteAlbum(albumId)

      router.push(`profile/${name}`)
    } catch (err: any | Error) {
      setAlert(err?.message || "Unexpected Error")
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const determineConfirm = (string: string) => {
    switch (string) {
      case "cancel":
        return handleCancel
      case "submit":
        return handleSubmit
      case "delete":
        return handleDeleteAlbum
      default:
        return () => {}
    }
  }


  useEffect(() => {
    if (data && data.Songs) {
      setSongs(() => {
        return data.Songs.map((song) => {
          return {
            current: {
              name: song.name,
              delete: false,
            },
            original: {
              name: song.name,
              position: song.position,
              id: song.id
            },
            key: crypto.randomUUID()
          }
        })
        
      })

      setAlbum({
        name: data.name
      })
    }
  }, [data])

  return (
    <div>
      <Alert message={alert} />
      <form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault()
          setConfirm("submit")
        }}
      >
        <h2>Edit Album</h2>
        <div>
          <label htmlFor="album-name">
            <span>Album Name</span>
            <input
              type="text"
              id="album-name"
              value={album.name}
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
                    value={song.current.name}
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
                {!song.original ? (
                  <button
                    type="button"
                    onClick={() => removeSong(i)}
                    className={css["delete-song"]}
                  >
                    x
                  </button>
                ) : (
                  <label
                    htmlFor={`delete-song${i}`}
                    className={css["delete-song"]}
                  >
                    <span className="upload-info">x</span>
                    <input
                      type="checkbox"
                      id={`delete-song${i}`}
                      name="delete"
                      checked={song.current.delete}
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
        <button type="button" onClick={() => setConfirm("delete")}>
          Delete Album
        </button>
        <button type="button" onClick={() => setConfirm("cancel")}>
          Cancel
        </button>
        {confirm && (
          <Confirm
            setConfirm={setConfirm}
            callback={determineConfirm(confirm)}
          />
        )}
      </form>
    </div>
  )
}
