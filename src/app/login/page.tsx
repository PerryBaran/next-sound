"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserContext } from "../../context/UserContext"
import Alert from "../../components/alert/Alert"
import { login } from "../../requests/users"
import Link from "next/link"
import css from "./login.module.css"

export default function Login() {
  const [fields, setFields] = useState({
    email: "",
    password: ""
  })
  const [alert, setAlert] = useState("")
  const { handleLogin } = useUserContext()
  const router = useRouter()

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAlert("")
    const EMAIL_REGEX = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/

    if (!fields.email) {
      setAlert("please provide your email address")
    } else if (!fields.password) {
      setAlert("please provide your password")
    } else if (!fields.email.match(EMAIL_REGEX)) {
      setAlert("please provide a valid email")
    } else {
      try {
        const user = await login(fields)
        handleLogin(user)
        router.push(`profile/${user.name}`)
      } catch (err: any | Error) {
        setAlert(err?.message || "Unexpected Error")
      }
    }
  }

  return (
    <div className={css["container"]}>
      <form onSubmit={handleSubmit} className={css["form"]}>
        <label htmlFor="email" className={css["field"]}>
          <span>Email</span>
          <input
            type="text"
            id="email"
            name="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </label>
        <label htmlFor="password" className={css["field"]}>
          <span>Password</span>
          <input
            type="password"
            id="password"
            name="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </label>
        <Alert message={alert} />
        <button type="submit" className={css["submit"]}>
          Login
        </button>
      </form>
      <p>
        Don&apos;t have an account? <Link href="/signup">Signup here</Link>
      </p>
    </div>
  )
}
