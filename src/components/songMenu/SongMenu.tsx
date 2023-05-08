"use client"

import { useState } from "react"
import css from "./songMenu.module.css"
import { usePlaylistContext } from "../../context/PlaylistContext"
import { play, addList, dots } from "../../media/icons/index"
import Image from "next/image"

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
            <span className={css["song-menu-image-container"]}>
              <Image src={play} alt="play now" width={9} />
            </span>
            <span>Play Now</span>
          </button>
          <button
            onMouseDown={() => handleAddToPlaylist(songs, true, false)}
            className={css["play-next"]}
          >
            <span className={css["song-menu-image-container"]}>
              <Image src={addList} alt="play now" width={15} />
            </span>
            <span>Play Next</span>
          </button>
          <button onMouseDown={() => handleAddToPlaylist(songs, false, false)}>
            <span className={css["song-menu-image-container"]}>
              <Image src={addList} alt="play now" width={15} />
            </span>
            <span>Add To Queue</span>
          </button>
        </div>
      ) : null}
      <button
        onClick={() => setVisible((prev) => !prev)}
        className={css.button}
      >
        <Image src={dots} alt="..." height={18} width={18} />
      </button>
    </div>
  )
}
