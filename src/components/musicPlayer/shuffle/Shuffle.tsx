"use client"

import { useState } from "react"
import { shuffle } from "@/media/icons/index"
import Image from "next/image"
import css from "./shuffle.module.css"

interface Props {
  handleShuffle: (value: boolean) => void
}

export default function Shuffle({ handleShuffle }: Props) {
  const [shuffled, setShuffled] = useState(false)

  const handleClick = () => {
    handleShuffle(!shuffled)
    setShuffled((prev) => !prev)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${css.container} ${!shuffled ? css.faded : null}`}
    >
      <Image src={shuffle} alt="shuffle" height={40} width={40} />
    </button>
  )
}
