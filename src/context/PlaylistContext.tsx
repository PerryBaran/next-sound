"use client"

import { createContext, useContext, useState } from "react"

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
  skipSong: (i: number | boolean, loop = false) => {},
  handleAddToPlaylist: (
    songs: Song[],
    addNext: boolean,
    playNow: boolean
  ) => {},
  removeFromPlaylist: (i: number) => {},
  playing: false,
  handlePlaying: (isPlaying?: boolean) => {},
  handleShuffle: (shuffled: boolean) => {}
})

const usePlaylistContext = () => useContext(PlaylistContext)

function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const [playlist, setPlaylist] = useState<Playlist[]>([])
  const [playlistIndex, setPlaylistIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [originalPlaylist, setOriginalPlaylist] = useState<Playlist[]>([])

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

    setOriginalPlaylist((prev) => {
      if (addNext) {
        const clone = [...prev]
        clone.splice(playlistIndex + 1, 0, ...data)
        return clone
      }
      return [...prev, ...data]
    })
  }

  const handlePlayNow = () => {
    if (playlist.length !== 0) {
      setPlaylistIndex((prev) => prev + 1)
    }
    setPlaying(true)
  }

  const handleAddToPlaylist = (
    songs: Song[],
    addNext: boolean,
    playNow: boolean
  ) => {
    addToPlaylist(songs, addNext)
    if (playNow) {
      handlePlayNow()
    }
  }

  const removeFromPlaylist = (i: number) => {
    setPlaylist((prev) => {
      const clone = [...prev]
      clone.splice(i, 1)
      return clone
    })

    setOriginalPlaylist((prev) => {
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

  const shuffle = () => {
    setPlaylist((prev) => {
      let clone = [...prev]
      let counter = clone.length

      while (counter > 0) {
        let i = Math.floor(Math.random() * counter)
        counter--

        let temp = clone[counter]
        clone[counter] = clone[i]
        clone[i] = temp
      }

      return clone
    })
  }

  const handleShuffle = (shuffled: boolean) => {
    if (shuffled) {
      shuffle()
    } else {
      setPlaylist(originalPlaylist)
    }
  }

  const skipSong = (value: number | boolean, loop = false) => {
    const lastPlaylistIndex = playlist.length - 1
    if (typeof value === "number") {
      if (value > lastPlaylistIndex) {
        setPlaylistIndex(lastPlaylistIndex)
      } else if (value < 0) {
        setPlaylistIndex(0)
      } else {
        setPlaylistIndex(value)
      }
    } else if (value) {
      if (playlistIndex < lastPlaylistIndex) {
        setPlaylistIndex((prev) => prev + 1)
      } else if (loop) {
        setPlaylistIndex(0)
      }
    } else {
      if (playlistIndex > 0) {
        setPlaylistIndex((prev) => prev - 1)
      } else if (loop) {
        setPlaylistIndex(lastPlaylistIndex)
      }
    }
  }

  const handlePlaying = (isPlaying?: boolean) => {
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
        handleAddToPlaylist,
        removeFromPlaylist,
        skipSong,
        playing,
        handlePlaying,
        handleShuffle
      }}
    >
      {children}
    </PlaylistContext.Provider>
  )
}

export { usePlaylistContext, PlaylistProvider }
