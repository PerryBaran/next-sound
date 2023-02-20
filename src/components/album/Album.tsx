'use client'

import Image from 'next/image'
import { music } from '@/media/icons'
import Link from 'next/link'
import Songs from './songs/Songs'
import css from './album.module.css'

interface Song {
  name: string
  url: string
  id: string
}

interface Props {
  artistName: string
  albumName: string
  albumArt: string
  songs: Song[]
  albumUserId: string
  albumId: string
}

export default function Album({
  artistName,
  albumName,
  albumArt,
  songs,
  albumUserId,
  albumId,
}: Props) {
  const songData = (songName: string, audio: string) => {
    return {
      image: albumArt,
      artistName,
      albumName,
      songName,
      audio,
    };
  };

  return (
    <div className={css.container}>
      <div className={css['album-info-container']}>
        <Image 
          src={albumArt || music}
          alt={`${albumName} cover art`}
          height={100}
          width={100}
        />
        <div className={css['album-info']}>
          <h2><Link href={`/profile/${artistName}`}>{artistName}</Link></h2>
          <h3>{albumName}</h3>
        </div>
      </div>
      <ul className={css['songs-container']}>
        {songs.map((song) => {
          return (
            <Songs
              key={song.id}
              songName={song.name}
              audio={song.url}
            />
          )
        })}
      </ul>
    </div>
  );
}