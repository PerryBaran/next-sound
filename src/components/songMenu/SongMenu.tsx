'use client'

import { useEffect, useState } from 'react'
import css from './songMenu.module.css'
import { usePlaylistContext } from '@/context/PlaylistContext'

interface Props {
  songs: {
    songName: string
    audio: string
    image: string
    artistName: string
    albumName: string
  }[]
}

export default function SongMenu({ songs }: Props) {
  const { addToPlaylist, handlePlaying, skipSong, playlist } =
    usePlaylistContext()
  const [visible, setVisible] = useState(false)
  const [playNow, setPlayNow] = useState(false)
  const [prevPlaylistLength, setPrevPlaylistLength] = useState(0)

  const handleAddToPlaylist = (addNext: boolean, playNow: boolean) => {
    addToPlaylist(songs, addNext)
    setPrevPlaylistLength(playlist.length)
    setPlayNow(true)
  }

  useEffect(() => {
    if (playNow === true) {
      if (prevPlaylistLength) {
        skipSong(true)
      }
      handlePlaying(true)
    }
    setPlayNow(false)
  }, [handlePlaying, playNow, skipSong, prevPlaylistLength])

  const handleBlur = () => {
    setVisible(false)
  }

  return (
    <div className={css.container} onBlur={handleBlur}>
      {visible ? (
        <div className={css['options']}>
          <button onMouseDown={() => handleAddToPlaylist(true, true)}>
            Play Now
          </button>
          <button onMouseDown={() => handleAddToPlaylist(true, false)}>
            Play Next
          </button>
          <button onMouseDown={() => handleAddToPlaylist(false, false)}>
            Add To Queue
          </button>
        </div>
      ) : null}
      <button onClick={() => setVisible((prev) => !prev)}>...</button>
    </div>
  )
}
