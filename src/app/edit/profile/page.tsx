"use client"

import { useUserContext } from "@/context/UserContext"
import EditProfileForm from "@/components/editProfileForm/editProfileForm"

export default function EditProfile() {
  const {
    user: { id }
  } = useUserContext()

  if (!id) return null

  return <EditProfileForm userId={id} />
}
