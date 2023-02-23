import Image from 'next/image'
import css from './album.module.css'
import { music } from '@/media/icons'
import Link from 'next/link'
import Songs from './songs/Songs'
import SongMenu from '../songMenu/SongMenu'

interface Song {
  name: string
  url: string
  id: string
}

interface Props {
  artistName: string
  albumName: string
  albumArt?: string
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
  albumId
}: Props) {
  const album = songs.map((song) => {
    return {
      songName: song.name,
      audio: song.url,
      image: albumArt,
      artistName,
      albumName
    }
  })

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
          <h2>
            <Link href={`/profile/${artistName}`}>{artistName}</Link>
          </h2>
          <h3>{albumName}</h3>
        </div>
        <SongMenu songs={album} />
      </div>
      <ul className={css['songs-container']}>
        {songs.map((song) => {
          return (
            <Songs
              key={song.id}
              songName={song.name}
              audio={song.url}
              image={albumArt}
              artistName={artistName}
              albumName={albumName}
            />
          )
        })}
      </ul>
    </div>
  )
}
