"use client"

import { useRef } from "react"
import css from "./confirmPassword.module.css"

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
    <div className={css["container"]}>
      <form
        onSubmit={handleSubmit}
        aria-label="form"
        className={css["confirm-password"]}
      >
        <label htmlFor="confirm">
          <span>Confirm Password</span>
          <input type="password" id="confirm" ref={password} />
        </label>
        <div>
          <button type="submit" className={css["confirm"]}>
            Confirm
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className={css["cancel"]}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
