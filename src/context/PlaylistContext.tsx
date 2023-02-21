'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react'

interface Song {
  image?: string
  artistName: string
  albumName: string
  songName: string
  audio: string
}

interface Playlist extends Song {
  key: string
}

const PlaylistContext = createContext({
  playlist: [] as Playlist[],
  playlistIndex: 0,
  skipSong: (i: number | boolean) => {},
  addToPlaylist: (songs: Song[], addNext: boolean) => {},
  removeFromPlaylist: (i: number) => {},
  playing: false,
  handlePlaying: (isPlaying: boolean | undefined) => {},
  handlePlayNow: () => {}
})

const usePlaylistContext = () => useContext(PlaylistContext)

function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const [playlist, setPlaylist] = useState<Playlist[]>([])
  const [playlistIndex, setPlaylistIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const handlePlayNow = usePlayNow(playlist.length, setPlaylistIndex, setPlaying)

  const addToPlaylist = (songs: Song[], addNext = false) => {
    const data = songs.map((song) => {
      return { ...song, key: crypto.randomUUID() }
    })

    setPlaylist((prev) => {
      if (addNext) {
        const clone = [...prev]
        clone.splice(playlistIndex + 1, 0, ...data)
        return clone
      }
      return [...prev, ...data]
    })
  }

  const removeFromPlaylist = (i: number) => {
    setPlaylist((prev) => {
      const clone = [...prev]
      clone.splice(i, 1)
      return clone
    })

    setPlaylistIndex((prev) => {
      if (i > prev || prev === 0) {
        return prev
      }
      return prev - 1
    })
  }

  const skipSong = (value: number | boolean) => {
    const lastPlaylistIndex = playlist.length - 1
    if (typeof value === 'number') {
      if (value > lastPlaylistIndex) {
        setPlaylistIndex(lastPlaylistIndex)
      } else if (value < 0) {
        setPlaylistIndex(0)
      } else {
        setPlaylistIndex(value)
      }
    } else if (value) {
      if (playlistIndex === lastPlaylistIndex) {
        setPlaylistIndex(0)
      } else {
        setPlaylistIndex((prev) => prev + 1)
      }
    } else {
      if (playlistIndex > 0) {
        setPlaylistIndex((prev) => prev - 1)
      } else {
        setPlaylistIndex(lastPlaylistIndex)
      }
    }
  }

  const handlePlaying = (isPlaying: boolean | undefined) => {
    if (isPlaying === undefined) {
      setPlaying((prev) => !prev)
    } else {
      setPlaying(isPlaying)
    }
  }

  return (
    <PlaylistContext.Provider
      value={{
        playlist,
        playlistIndex,
        addToPlaylist,
        removeFromPlaylist,
        skipSong,
        playing,
        handlePlaying,
        handlePlayNow
      }}
    >
      {children}
    </PlaylistContext.Provider>
  )
}

function usePlayNow(
  playlistLength: number,
  setPlaylistIndex: React.Dispatch<React.SetStateAction<number>>,
  handlePlaying: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [playNow, setPlayNow] = useState(false)
  const [skip, setSkip] = useState(false)

  const handlePlayNow = () => {
    setPlayNow(true)
    setSkip(() => playlistLength !== 0)
  }

  useEffect(() => {
    if (playNow) {
      if (skip) {
        setPlaylistIndex((prev) => prev + 1)
      }
      handlePlaying(true)
    }
    setPlayNow(false)
  }, [handlePlaying, playNow, setPlaylistIndex, skip])

  return handlePlayNow
}

export { usePlaylistContext, PlaylistProvider }
