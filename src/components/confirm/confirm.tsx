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
    <div>
      <div>
        <h3>Are You Sure?</h3>
        <button type="button" onClick={handleYes}>
          Yes
        </button>
        <button type="button" onClick={handleNo}>
          No
        </button>
      </div>
    </div>
  )
}
