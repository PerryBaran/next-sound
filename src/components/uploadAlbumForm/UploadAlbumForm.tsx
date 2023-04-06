"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Alert from "@/components/alert/Alert"
import { deleteAlbum } from "@/requests/albums"
import { useUserContext } from "@/context/UserContext"
import css from "./editAlbum.module.css"
import Confirm from "../confirm/Confirm"
import updateAlbum from "./helpers/updateAlbum"
import uploadAlbum from "./helpers/uploadAlbum"

interface Props {
  data?: {
    name: string
    id: string
    Songs?: {
      name: string
      position: number
      id: string
    }[]
    albumId: string
  }
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

export default function UploadAlbumForm({ data }: Props) {
  const [album, setAlbum] = useState<Album>({
    name: data ? data.name : ""
  })
  const [songs, setSongs] = useState<Songs[]>(
    data && data.Songs
      ? data.Songs.map((song) => {
          return {
            current: {
              name: song.name,
              delete: false
            },
            original: {
              name: song.name,
              position: song.position,
              id: song.id
            },
            key: crypto.randomUUID()
          }
        })
      : [
          {
            current: {
              name: "",
              delete: false
            },
            key: crypto.randomUUID()
          }
        ]
  )
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

  const dragEnter = (position: number) => {
    dragOver.current = position
  }

  const dragEnd = (startPosition: number) => {
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
    if (data) {
      await updateAlbum(data, album, songs, setAlert, router, name)
    } else {
      await uploadAlbum(
        album,
        songs.map((song) => song.current),
        setAlert,
        router,
        name
      )
    }
  }

  const handleDeleteAlbum = async () => {
    if (data) {
      try {
        await deleteAlbum(data.albumId)

        router.push(`profile/${name}`)
      } catch (err: any | Error) {
        setAlert(err?.message || "Unexpected Error")
      }
    } else {
      setAlert("Cannot delete album")
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const confirmCallback = (string: string) => {
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

  return (
    <div>
      <Alert message={alert} />
      <form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault()
          setConfirm("submit")
        }}
      >
        <h2>{data ? "Edit Album" : "Upload Album"}</h2>
        <div>
          <label htmlFor="album-name">
            <span>Name</span>
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
                onDragEnter={() => dragEnter(i)}
                onDragEnd={() => dragEnd(i)}
                className={css.song}
              >
                <h4>Song {i + 1}</h4>
                <label htmlFor={`song-name${i}`}>
                  <span>Name</span>
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
        <button type="submit">{data ? "Save Changes" : "Upload"}</button>
        {data && (
          <button type="button" onClick={() => setConfirm("delete")}>
            Delete Album
          </button>
        )}
        <button type="button" onClick={() => setConfirm("cancel")}>
          Cancel
        </button>
        {confirm && (
          <Confirm
            setConfirm={setConfirm}
            callback={confirmCallback(confirm)}
          />
        )}
      </form>
    </div>
  )
}
