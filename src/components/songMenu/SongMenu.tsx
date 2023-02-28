"use client"

import { useState } from "react"
import css from "./songMenu.module.css"
import { usePlaylistContext } from "@/context/PlaylistContext"

interface Props {
  songs: {
    songName: string
    audio: string
    image?: string
    artistName: string
    albumName: string
  }[]
}

export default function SongMenu({ songs }: Props) {
  const { handleAddToPlaylist } = usePlaylistContext()
  const [visible, setVisible] = useState(false)

  const handleBlur = () => {
    setVisible(false)
  }

  return (
    <div className={css.container} onBlur={handleBlur}>
      {visible ? (
        <div className={css.options}>
          <button onMouseDown={() => handleAddToPlaylist(songs, true, true)}>
            Play Now
          </button>
          <button onMouseDown={() => handleAddToPlaylist(songs, true, false)}>
            Play Next
          </button>
          <button onMouseDown={() => handleAddToPlaylist(songs, false, false)}>
            Add To Queue
          </button>
        </div>
      ) : null}
      <button onClick={() => setVisible((prev) => !prev)}>...</button>
    </div>
  )
}
