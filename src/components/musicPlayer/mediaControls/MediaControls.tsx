"use client"

import Image from "next/image"
import css from "./mediaControls.module.css"
import { play, pause, skip } from "../../../media/icons"
import { usePlaylistContext } from "../../../context/PlaylistContext"

interface Props {
  playing: boolean
  skipSong: (value: number | boolean) => void
}

export default function MediaControls({ playing, skipSong }: Props) {
  const { handlePlaying } = usePlaylistContext()

  return (
    <div className={css["container"]}>
      <button onClick={() => skipSong(false)}>
        <Image
          src={skip}
          alt="skip backwards"
          height={20}
          width={20}
          style={{ transform: "rotate(180deg)" }}
        />
      </button>
      <button onClick={() => handlePlaying()}>
        {playing ? (
          <Image src={pause} alt="pause" height={20} width={20} />
        ) : (
          <Image src={play} alt="play" height={20} width={20} />
        )}
      </button>
      <button onClick={() => skipSong(true)}>
        <Image src={skip} alt="skip forwards" height={20} width={20} />
      </button>
    </div>
  )
}
