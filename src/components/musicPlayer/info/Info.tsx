'use client'

import style from './info.module.css'
import Image from 'next/image'
import { music } from '@/media/icons'

interface Props {
  albumArt: string | undefined
  artistName: string | undefined
  songName: string | undefined
}

export default function Info(props: Props) {
  const { albumArt, artistName, songName } = props

  return (
    <div className={style.container}>
      <Image
        src={albumArt || music}
        alt={`${artistName} cover art`}
        height={75}
        width={75}
      />
      <div>
        <h3>{artistName}</h3>
        <p>{songName}</p>
      </div>
    </div>
  )
}
