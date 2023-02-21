'use client'

import Image from 'next/image'
import style from './volume.module.css'
import { volumeLow, volumeMedium, volumeMute } from '@/media/icons'
import { useState } from 'react'

interface Props {
  volume: number
  handleVolume: (value: number) => void
}

export default function Volume({ volume, handleVolume }: Props) {
  const [toggleVolume, setToggleVolume] = useState(volume)

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentVolume = Number(e.target.value) / 100
    handleVolume(currentVolume)
  }

  const handleVolumeToggle = () => {
    const preVolume = volume
    if (preVolume !== 0) {
      handleVolume(0)
      setToggleVolume(preVolume)
    } else {
      handleVolume(toggleVolume)
    }
  }

  return (
    <div className={style.container}>
      <input
        type="range"
        name="volume"
        min={0}
        max={100}
        value={volume * 100}
        onChange={changeVolume}
        data-testid="volume"
      />
      <button
        className={style.volume}
        type="button"
        onClick={handleVolumeToggle}
      >
        <VolumeIcon volume={volume} />
      </button>
    </div>
  )
}

function VolumeIcon({ volume }: { volume: number }) {
  if (volume === 0)
    return <Image src={volumeMute} alt="volume muted" height={30} width={30} />

  if (volume < 0.5)
    return <Image src={volumeLow} alt="low volume" height={30} width={30} />

  return <Image src={volumeMedium} alt="high volume" height={30} width={30} />
}
