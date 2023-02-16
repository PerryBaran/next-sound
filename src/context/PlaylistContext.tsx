'use client'

import { createContext, useState } from 'react'

interface Song {
  image?: string,
  artistName: string,
  albumName: string,
  songName: string,
  audio: string,
  key?: string,
};

interface Context {
  playlist: Song[],
  playlistIndex: number,
  setPlaylistIndex: (i: number) => void,
  addToPlaylist: (songs: Song[], addNext: boolean) => void,
  removeFromPlaylist: (i: number) => void,
}

const PlaylistContext = createContext<Context>({
  playlist: [],
  playlistIndex: 0,
  addToPlaylist: () => {},
  removeFromPlaylist: () => {},
  setPlaylistIndex: () => {},
})

export default function MusicProvider({ 
  children 
}: {
  children: React.ReactNode
}) {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [playlistIndex, setPlaylistIndex] = useState(0);

  const addToPlaylist = (songs: Song[], addNext = false) => {
    const data = songs.map((song) => {
      const clone = song
      clone.key = crypto.randomUUID()
      return clone
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