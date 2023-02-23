import Image from 'next/image'
import css from './song.module.css'
import { music } from '@/media/icons'
import Link from 'next/link'
import SongMenu from '../songMenu/SongMenu'

interface Props {
  artistName: string
  albumName: string
  albumArt: string
  songName: string
  songAudio: string
}
export default function Song({
  artistName,
  albumName,
  albumArt,
  songName,
  songAudio,
}: Props) {
  return (
    <div className={css.song}>
      <div className={css["song__info-container"]}>
        <Image
          src={albumArt || music}
          alt={`${albumName} cover art`}
          height={100}
          width={100}
        />
        <div className={css["song__info"]}>
          <h2 className={css["song__artist-name"]}>
            <Link href={`/profile/${artistName}`}>{artistName}</Link>
          </h2>
          <h3 className={css["song__song-name"]}>
            {songName}
          </h3>
        </div>
        <SongMenu 
          songs={[{
            songName,
            audio: songAudio,
            image: albumArt,
            artistName,
            albumName
          }]}
        />
      </div>
    </div>
  )
}