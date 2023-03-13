interface Props {
  loop: string
  handleLoop: () => void
}

export default function Loop({ loop, handleLoop }: Props) {
  return (
    <button type="button" onClick={handleLoop}>
      {loop}
    </button>
  )
}
