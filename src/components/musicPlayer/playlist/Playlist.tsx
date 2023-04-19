"use client"

import Image from "next/image"
import { useState } from "react"
import { usePlaylistContext } from "../../../context/PlaylistContext"
import css from "./playlist.module.css"
import { play, music, menu, close } from "../../../media/icons"

export default function Playlist() {
  const {
    playlist,
    playlistIndex,
    skipSong,
    removeFromPlaylist,
    handlePlaying
  } = usePlaylistContext()
  const [showPlaylist, setShowPlaylist] = useState(false)

  const handleSetPlaying = (i: number) => {
    skipSong(i)
    handlePlaying(true)
  }

  return (
    <>
      {showPlaylist && (
        <div className={css["container"]}>
          {playlist.length === 0 ? (
            <p className={css["empty"]}>Playlist Empty</p>
          ) : (
            playlist.map((song, i) => {
              return (
                <div
                  key={song.key}
                  className={`${css["song"]} 
                ${playlistIndex === i && css["active"]}
              }`}
                >
                  <div className={css["song-left"]}>
                    <Image
                      src={song.image || music}
                      alt={`${song.albumName} cover art`}
                      height={40}
                      width={40}
                    />
                  </div>
                  <div className={css["song-right"]}>
                    <div className={css["song-info"]}>
                      <p className={css["artist"]}>{song.artistName}</p>
                      <p className={css["song-name"]}>{song.songName}</p>
                    </div>
                    <button
                      type="button"
                      className={css["play"]}
                      onClick={() => handleSetPlaying(i)}
                    >
                      <Image src={play} alt="play now" height={20} width={20} />
                    </button>
                    <button
                      type="button"
                      className={css["remove"]}
                      onClick={() => removeFromPlaylist(i)}
                    >
                      <Image src={close} alt="remove" height={18} width={18} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => setShowPlaylist((prev) => !prev)}
        className={`${css["toggle-playlist"]} ${!showPlaylist && css["faded"]}`}
      >
        <Image src={menu} alt="playlist" height={30} width={30} />
      </button>
    </>
  )
}
