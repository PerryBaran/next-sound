'use client'

import { createContext, useContext, useState } from 'react'

interface Song {
  image?: string,
  artistName: string,
  albumName: string,
  songName: string,
  audio: string,
};

interface Playlist extends Song {
  key: string,
}

const PlaylistContext = createContext({
  playlist: [] as Playlist[],
  playlistIndex: 0,
  setPlaylistIndex: (i: number) => {},
  addToPlaylist: (songs: Song[], addNext: boolean) => {},
  removeFromPlaylist: (i: number) => {},
})

const usePlaylistContext = () => useContext(PlaylistContext);

function PlaylistProvider({ 
  children 
}: {
  children: React.ReactNode
}) {
  const [playlist, setPlaylist] = useState<Playlist[]>([]);
  const [playlistIndex, setPlaylistIndex] = useState(0);

  const addToPlaylist = (songs: Song[], addNext = false) => {
    const data = songs.map((song) => {
      return {...song, key: crypto.randomUUID()}
    })

    setPlaylist((prev) => {
      if (addNext) {
        const clone = [...prev];
        clone.splice(playlistIndex + 1, 0, ...data);
        return clone
      }
      return [...prev, ...data];
    })
  };
  
  const removeFromPlaylist = (i: number) => {
    setPlaylist((prev) => {
      const clone = [...prev];
      clone.splice(i, 1);
      return clone;
    });

    setPlaylistIndex((prev) => {
      if (i > prev || prev === 0) {
        return prev;
      }
      return prev - 1;
    });
  }

  return (
    <PlaylistContext.Provider value={{
      playlist,
      playlistIndex,
      addToPlaylist,
      removeFromPlaylist,
      setPlaylistIndex,
    }}>
      {children}
    </PlaylistContext.Provider>
  )
}

export { usePlaylistContext, PlaylistProvider }