import Image from "next/image"
import Link from "next/link"
import css from "./album.module.css"
import { music } from "@/media/icons"
import Songs from "./songs/Songs"
import EditButton from "./EditButton/EditButton"
import SongMenu from "../songMenu/SongMenu"

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
  profile: boolean
}

export default function Album({
  artistName,
  albumName,
  albumArt,
  songs,
  albumUserId,
  albumId,
  profile
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

  if (songs.length === 0 && !profile) return null

  return (
    <div className={css.container}>
      <div className={css["album-info-container"]}>
        <Image
          src={albumArt || music}
          alt={`${albumName} cover art`}
          height={100}
          width={100}
        />
        <div className={css["album-info"]}>
          <h2>
            <Link href={`/profile/${artistName}`}>{artistName}</Link>
          </h2>
          <h3>{albumName}</h3>
        </div>
        <SongMenu songs={album} />
        <EditButton
          albumId={albumId}
          albumUserId={albumUserId}
          profile={profile}
        />
      </div>
      <ul className={css["songs-container"]}>
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
