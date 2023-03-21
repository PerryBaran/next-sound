"use client"

import { useRef } from "react"

interface Props {
  callback: (string: string) => void
  setConfirm: (string: string) => void
}

export default function ConfirmPassword({ callback, setConfirm }: Props) {
  const password = useRef<HTMLInputElement>(null)

  const handleCancel = () => {
    setConfirm("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.current) {
      callback(password.current.value)
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="form">
      <label htmlFor="confirm">
        <span>Confirm Password</span>
        <input type="password" id="confirm" ref={password} />
      </label>
      <button type="submit">Confirm</button>
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  )
}
