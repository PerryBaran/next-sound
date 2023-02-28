"use client"

import style from "./info.module.css"
import Image from "next/image"
import { music } from "@/media/icons"

interface Props {
  albumArt: string | undefined
  artistName: string | undefined
  songName: string | undefined
  albumName: string | undefined
}

export default function Info(props: Props) {
  const { albumArt, artistName, albumName, songName } = props

  return (
    <div className={style.container}>
      {albumArt ? (
        <Image
          src={albumArt}
          alt={`${albumName} cover art`}
          height={75}
          width={75}
        />
      ) : (
        <Image
          src={music}
          alt="default cover art"
          height={75}
          width={75}
          style={{ filter: "invert()" }}
        />
      )}

      <div>
        <h3>{artistName}</h3>
        <p>{songName}</p>
      </div>
    </div>
  )
}
