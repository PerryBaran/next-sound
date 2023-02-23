import css from './songs.module.css'
import SongMenu from '../../songMenu/SongMenu'

interface Props {
  songName: string
  audio: string
  image?: string
  artistName: string
  albumName: string
}

export default function Songs(props: Props) {
  return (
    <li className={css.container}>
      <h4>{props.songName}</h4>
      <SongMenu songs={[props]} />
    </li>
  )
}
