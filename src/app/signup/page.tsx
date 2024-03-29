"use client"

import Alert from "../../components/alert/Alert"
import { useUserContext } from "../../context/UserContext"
import { signup } from "../../requests/users"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import css from "../login/login.module.css"

export default function SignUp() {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
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

    const EMAIL_REGEX = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/

    if (!fields.name) {
      setAlert("please provide a username")
    } else if (!fields.email) {
      setAlert("please provide your email address")
    } else if (!fields.email.match(EMAIL_REGEX)) {
      setAlert("please provide a valid email")
    } else if (!fields.password) {
      setAlert("please insert your password")
    } else if (fields.password.length < 8) {
      setAlert("password must be atleast 8 characters long")
    } else if (fields.confirmPassword !== fields.password) {
      setAlert("passwords must match")
    } else {
      try {
        const response = await signup({
          name: fields.name,
          email: fields.email,
          password: fields.password
        })
        handleLogin(response)
        router.push(`/profile/${response.name}`)
      } catch (err: any | Error) {
        setAlert(err?.message || "Unexpected Error")
      }
    }
  }

  return (
    <div className={css["container"]}>
      <form onSubmit={handleSubmit} className={css["form"]}>
        <label htmlFor="name" className={css["field"]}>
          <span>Username</span>
          <input
            type="text"
            id="name"
            name="name"
            value={fields.name}
            onChange={handleFieldChange}
          />
        </label>
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
        <label htmlFor="confirmPassword" className={css["field"]}>
          <span>Confirm Password</span>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={fields.confirmPassword}
            onChange={handleFieldChange}
          />
        </label>
        <Alert message={alert} />
        <button type="submit" className={css["submit"]}>
          SignUp
        </button>
      </form>
      <p>
        Already have an account? <Link href="/login">Login here</Link>
      </p>
    </div>
  )
}
