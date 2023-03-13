"use client"

import { useState } from "react"

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
    <button type="button" onClick={handleClick}>
      {shuffled ? "shuffle" : "no"}
    </button>
  )
}
