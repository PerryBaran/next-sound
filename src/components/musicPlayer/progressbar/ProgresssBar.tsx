"use client"

import { ChangeEvent, useEffect, useState } from "react"
import style from "./progressBar.module.css"

interface Props {
  handleAudioTime: (value: number) => void
  time: number
  duration: number
}

export default function ProgresssBar(props: Props) {
  const { handleAudioTime, time, duration } = props
  const [rangeValue, setRangeValue] = useState(time)

  useEffect(() => {
    setRangeValue(time)
  }, [time])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)
    handleAudioTime(time)
    setRangeValue(time)
  }

  return (
    <input
      type="range"
      name="time"
      min={0}
      max={duration}
      value={rangeValue}
      onChange={handleChange}
      className={style.bar}
      data-testid="progress-bar"
    />
  )
}
