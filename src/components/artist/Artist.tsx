import Image from "next/image"
import css from "./artist.module.css"
import { profile } from "../../media/icons"
import Link from "next/link"

interface Props {
  name: string
  image?: string
}

export default function Artist({ name, image }: Props) {
  return (
    <div className={css["container"]}>
      <Link href={`/profile/${name}`} className={css["link"]}>
        <Image
          src={image || profile}
          alt={`album by ${name}`}
          height={100}
          width={100}
        />
        <h2 className={css["name"]}>{name}</h2>
      </Link>
    </div>
  )
}
