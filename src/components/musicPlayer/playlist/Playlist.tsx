'use client'

import Image from 'next/image'
import { usePlaylistContext } from '@/context/PlaylistContext'
import css from './playlist.module.css'
import { play, music } from '@/media/icons'
import { useState } from 'react'
import { menu } from '@/media/icons'

interface Props {
  handlePlaying: (isPlayin: boolean | undefined) => void
}

export default function Playlist({ handlePlaying }: Props) {
  const { playlist, playlistIndex, skipSong, removeFromPlaylist } =
    usePlaylistContext()
  const [showPlaylist, setShowPlaylist] = useState(false)

  const handleSetPlaying = (i: number) => {
    skipSong(i)
    handlePlaying(true)
  }

  return (
    <>
      {showPlaylist && (
        <div className={css.container}>
          {playlist.map((song, i) => {
            return (
              <div
                key={song.key}
                className={`${css.playlist__song} 
                ${playlistIndex === i && css.play__song_active}
              }`}
              >
                <div className={css.playlist__song_left}>
                  <Image
                    src={song.image || music}
                    alt={`${song.albumName} cover art`}
                    height={30}
                    width={30}
                  />
                </div>
                <div className={css.playlist__song_right}>
                  <div className={css.playlist__song_info}>
                    <p className={css.playlist__song_artist}>
                      {song.artistName}
                    </p>
                    <p className={css.playlist__song_name}>{song.songName}</p>
                  </div>
                  <button
                    type="button"
                    className={css.playlist__play_now}
                    onClick={() => handleSetPlaying(i)}
                  >
                    <Image src={play} alt="play now" />
                  </button>
                  <button
                    type="button"
                    className={css.playlist__remove}
                    onClick={() => removeFromPlaylist(i)}
                  >
                    x
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <button
        type="button"
        onClick={() => setShowPlaylist((prev) => !prev)}
        className={css.toggle_playlist}
      >
        <Image src={menu} alt="playlist" height={30} width={30} />
      </button>
    </>
  )
}
