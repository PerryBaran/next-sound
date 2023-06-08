import css from "./album-songs.module.css"
import SongMenu from "../../songMenu/SongMenu"

interface Props {
  songName: string
  audio: string
  image?: string
  artistName: string
  albumName: string
}

export default function AlbumSongs(props: Props) {
  return (
    <li className={css["container"]}>
      <h4>{props.songName}</h4>
      <SongMenu songs={[props]} />
    </li>
  )
}
