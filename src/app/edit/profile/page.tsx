"use client"

import { useUserContext } from "@/context/UserContext"
import useSWR from "swr"
import { deleteUser, getUserById, patchUser } from "@/requests/users"
import { useEffect, useState } from "react"
import Alert from "@/components/alert/Alert"
import { useRouter } from "next/navigation"
import ConfirmPassword from "@/components/confirmPassword/confirmPassword"
import Confirm from "@/components/confirm/confirm"

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
    current: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    original: {
      name: "",
      email: "",
    }
  })
  const [alert, setAlert] = useState("")
  const router = useRouter()
  const { user, handleLogin } = useUserContext()
  const [confirm, setConfirm] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => {
      const clone = {...prev}
      switch(name) {
        case "name": { 
          clone.current.name = value
          break
        }
        case "email": {
          clone.current.email = value
          break
        }
        case "password": {
          clone.current.password = value
          break
        }
        case "confirmPassword": {
          clone.current.confirmPassword = value
          break
        }
      }
      return clone
    })
  }

  const handleSubmit = async () => {
    const EMAIL_REGEX = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/

    if (userData.current.name === userData.original.name && userData.current.email === userData.original.email && !userData.current.password) {
      setAlert("No changes requested")
    } else if (!userData.current.name) {
      setAlert("Name cannot be empty")
    } else if (userData.current.email !== userData.original.email && !userData.current.email.match(EMAIL_REGEX)) {
      setAlert("Email must be valid")
    } else if (userData.current.password && userData.current.password.length < 8) {
      setAlert("Password must be atleast 8 characters long")
    } else if (
      userData.current.password &&
      userData.current.password !== userData.current.confirmPassword
    ) {
      setAlert("Passwords do not match")
    } else {
      const data = {
        name: userData.current.name || undefined,
        email: userData.current.email || undefined,
        password: userData.current.password || undefined
      }

      try {
        await patchUser(userId, data)

        if (userData.current.name) {
          handleLogin({ name: userData.current.name })
        }

        router.push(`/profile/${userData.current.name || user.name}`)
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
          current: {
            name,
            email,
            password: "",
            confirmPassword: ""
          },
          original: {
            name,
            email
          }
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
            value={userData.current.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="email">
          <span>Email</span>
          <input
            type="text"
            id="email"
            name="email"
            value={userData.current.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          <span>New Password</span>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.current.password}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="confirm-password">
          <span>Confirm New Password</span>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            value={userData.current.confirmPassword}
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
