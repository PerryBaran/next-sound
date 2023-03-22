"use client"

import { useEffect, useState } from "react"
import style from "./progressBar.module.css"

interface Props {
  handleAudioTime: (value: number) => void
  time: number
  duration: number
}

export default function ProgresssBar(props: Props) {
  const { handleAudioTime, time, duration } = props

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)
    handleAudioTime(time)
  }

  return (
    <input
      type="range"
      name="time"
      min={0}
      max={duration}
      value={time}
      onChange={handleChange}
      className={style.bar}
    />
  )
}
