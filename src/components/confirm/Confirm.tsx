import css from "./confirm.module.css"

interface Props {
  callback: () => void
  setConfirm: (string: string) => void
}

export default function Confirm({ callback, setConfirm }: Props) {
  const handleNo = () => {
    setConfirm("")
  }

  const handleYes = () => {
    setConfirm("")
    callback()
  }

  return (
    <div className={css["container"]}>
      <div className={css["confirm"]}>
        <h3 className={css["are-you-sure"]}>Are You Sure?</h3>
        <div>
          <button type="button" onClick={handleYes} className={css["yes"]}>
            Yes
          </button>
          <button type="button" onClick={handleNo} className={css["no"]}>
            No
          </button>
        </div>
      </div>
    </div>
  )
}
