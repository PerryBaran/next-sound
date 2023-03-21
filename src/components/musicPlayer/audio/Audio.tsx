"use client"

import { RefObject, useEffect } from "react"

interface Props {
  playing: boolean
  source: string | undefined
  audioRef: RefObject<HTMLAudioElement>
  setDuration: (value: number) => void
  skipSong: (value: number | boolean) => void
}

export default function Audio({
  playing,
  source,
  audioRef,
  setDuration,
  skipSong
}: Props) {
  const handleLoadedMetaData = () => {
    if (audioRef.current) {
      const seconds = Math.round(audioRef.current.duration) || 0
      setDuration(seconds)
      if (playing) {
        audioRef.current.play()
      }
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [playing, source, audioRef])

  return (
    <audio
      ref={audioRef}
      src={source}
      onLoadedMetadata={handleLoadedMetaData}
      onEnded={() => skipSong(true)}
      data-testid="audio"
    />
  )
}
