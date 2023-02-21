'use client'

import { useState, useEffect, useRef } from 'react'
import css from './musicPlayer.module.css'
import Audio from './audio/Audio'
import Info from './info/Info'
import ProgresssBar from './progressbar/ProgresssBar'
import Time from './time/Time'
import MediaControls from './mediaControls/MediaControls'
import Volume from './volume/Volume'
import Playlist from './playlist/Playlist'
import { usePlaylistContext } from '@/context/PlaylistContext'

export default function MusicPlayer() {
  const { playlist, playlistIndex, skipSong, playing } = usePlaylistContext()

  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement>(null)

  const song = playlist[playlistIndex] || {}

  const handleVolume = (value: number) => {
    if (value > 1) {
      setVolume(1)
    } else if (value < 0) {
      setVolume(0)
    } else {
      setVolume(value)
    }
  }

  const handleAudioTime = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value
    }
  }

  useEffect(() => {
    const updateTimer = setInterval(() => {
      if (audioRef.current) {
        const seconds = Math.round(audioRef.current.currentTime)
        setTime(seconds)
      }
    }, 250)
    return () => clearInterval(updateTimer)
  }, [time])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume, audioRef])

  return (
    <>
      <div className={css.spacer} />
      <section className={css.container}>
        <Audio
          playing={playing}
          source={song.audio}
          audioRef={audioRef}
          setDuration={setDuration}
          skipSong={skipSong}
        />
        <Info
          albumArt={song.image}
          artistName={song.artistName}
          albumName={song.albumName}
          songName={song.songName}
        />
        <div className={css.center}>
          <ProgresssBar
            handleAudioTime={handleAudioTime}
            time={time}
            duration={duration}
          />
          <div className={css.belowBar}>
            <Time time={time} />
            <MediaControls playing={playing} skipSong={skipSong} />
            <Time time={duration} />
          </div>
        </div>
        <div className={css.centerButton}>
          <Volume volume={volume} handleVolume={handleVolume} />
        </div>
        <div className={css.centerButton}>
          <Playlist />
        </div>
      </section>
    </>
  )
}
