"use client"

import { useUserContext } from "@/context/UserContext"
import useSWR from "swr"
import { deleteUser, getUserById, patchUser } from "@/requests/users"
import { useEffect, useState } from "react"
import Alert from "@/components/alert/Alert"
import { useRouter } from "next/navigation"
import ConfirmPassword from "@/components/confirmPassword/ConfirmPassword"
import Confirm from "@/components/confirm/Confirm"

export default function EditProfile() {
  const {
    user: { id }
  } = useUserContext()

  if (!id) return null

  return <EditProfileForm userId={id} />
}

interface Props {
  userId: string
}

interface SWRRequest {
  name: string
  email: string
}

function EditProfileForm({ userId }: Props) {
  const { data }: { data: SWRRequest } = useSWR(`${userId}`, getUserById)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [alert, setAlert] = useState("")
  const router = useRouter()
  const { user, handleLogin } = useUserContext()
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
      userData.email === userData.email &&
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
      handleLogin(undefined)
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

  useEffect(() => {
    if (data) {
      const { name, email } = data
      setUserData(() => {
        return {
          name,
          email,
          password: "",
          confirmPassword: ""
        }
      })
    }
  }, [data])

  return (
    <div>
      <Alert message={alert} />
      <form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault()
          setConfirm("submit")
        }}
      >
        <h2>Edit Profile</h2>
        <label htmlFor="name">
          <span>Name</span>
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="email">
          <span>Email</span>
          <input
            type="text"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          <span>New Password</span>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="confirm-password">
          <span>Confirm New Password</span>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => setConfirm("delete")}>
          Delete Account
        </button>
        <button type="button" onClick={() => setConfirm("cancel")}>
          Cancel
        </button>
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
