import { loop as loopPlaylist, loopSong } from "../../../media/icons"
import Image from "next/image"
import css from "./loop.module.css"

interface Props {
  loop: "" | "song" | "playlist"
  handleLoop: () => void
}

export default function Loop({ loop, handleLoop }: Props) {
  return (
    <button
      type="button"
      onClick={handleLoop}
      className={`${css.container} ${loop === "" ? css.faded : null}`}
    >
      {loop === "song" ? (
        <Image src={loopSong} alt="loop song" height={40} width={40} />
      ) : (
        <Image
          src={loopPlaylist}
          alt={loop === "" ? "loop" : "loop playlist"}
          height={40}
          width={40}
        />
      )}
    </button>
  )
}
