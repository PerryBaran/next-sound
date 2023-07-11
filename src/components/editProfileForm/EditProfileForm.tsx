"use client"

import { useUserContext } from "../../context/UserContext"
import { deleteUser, patchUser } from "../../requests/users"
import { useState } from "react"
import Alert from "../../components/alert/Alert"
import { useRouter } from "next/navigation"
import ConfirmPassword from "../../components/confirmPassword/ConfirmPassword"
import Confirm from "../../components/confirm/Confirm"
import css from "./editProfileForm.module.css"

export default function EditProfileForm({
  data,
  userId
}: {
  data: { name: string; email: string }
  userId: string
}) {
  const [userData, setUserData] = useState({
    name: data.name,
    email: data.email,
    password: "",
    confirmPassword: ""
  })
  const [alert, setAlert] = useState("")
  const router = useRouter()
  const { handleLogin } = useUserContext()
  const [confirm, setConfirm] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const handleSubmit = async () => {
    const EMAIL_REGEX = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/

    if (
      userData.name === data.name &&
      userData.email === data.email &&
      !userData.password
    ) {
      setAlert("No changes requested")
    } else if (!userData.name) {
      setAlert("Name cannot be empty")
    } else if (
      userData.email !== data.email &&
      !userData.email.match(EMAIL_REGEX)
    ) {
      setAlert("Email must be valid")
    } else if (userData.password && userData.password.length < 8) {
      setAlert("Password must be atleast 8 characters long")
    } else if (
      userData.password &&
      userData.password !== userData.confirmPassword
    ) {
      setAlert("Passwords do not match")
    } else {
      const data = {
        name: userData.name || undefined,
        email: userData.email || undefined,
        password: userData.password || undefined
      }

      try {
        await patchUser(userId, data)

        if (userData.name) {
          handleLogin({ name: userData.name })
        }

        router.push(`/profile/${userData.name}`)
      } catch (err: any | Error) {
        setAlert(err?.message || "Unexpected Error")
      }
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const handleDeleteAlbum = async (password: string) => {
    try {
      await deleteUser(userId, password)
      handleLogin()
      router.push("/")
    } catch (err: any | Error) {
      setAlert(err?.message || "Unexpected Error")
    }
  }

  const determineConfirm = (string: string) => {
    switch (string) {
      case "cancel":
        return handleCancel
      case "submit":
        return handleSubmit
      default:
        return () => {}
    }
  }

  return (
    <div className={css["container"]}>
      <Alert message={alert} />
      <form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault()
          setConfirm("submit")
        }}
        className={css["form"]}
      >
        <h2 className={css["heading"]}>Edit Profile</h2>
        <label htmlFor="name" className={css["field"]}>
          <span>Name</span>
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="email" className={css["field"]}>
          <span>Email</span>
          <input
            type="text"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password" className={css["field"]}>
          <span>New Password</span>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="confirm-password" className={css["field"]}>
          <span>Confirm New Password</span>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
          />
        </label>
        <div className={css["buttons"]}>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setConfirm("delete")}>
            Delete Account
          </button>
          <button type="button" onClick={() => setConfirm("cancel")}>
            Cancel
          </button>
        </div>
      </form>
      {confirm === "delete" && (
        <ConfirmPassword callback={handleDeleteAlbum} setConfirm={setConfirm} />
      )}
      {confirm && confirm !== "delete" && (
        <Confirm setConfirm={setConfirm} callback={determineConfirm(confirm)} />
      )}
    </div>
  )
}
