import style from "./progressBar.module.css"

interface Props {
  handleAudioTime: (value: number) => void
  time: number
  duration: number
}

export default function ProgresssBar({
  handleAudioTime,
  time,
  duration
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value)
    handleAudioTime(newTime)
  }

  return (
    <div className={style.container}>
      <input
        type="range"
        name="time"
        min={0}
        max={duration}
        value={time}
        onChange={handleChange}
        className={style.bar}
      />      
    </div>
  )
}
