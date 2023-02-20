import css from './songs.module.css'

interface Props {
  songName: string,
  audio: string
}

export default function Songs({
  songName,
  audio
}: Props) {
  return (
    <li className={css.container}>
      <h4>{songName}</h4>
    </li>
  )
}