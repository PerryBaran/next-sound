"use client"

import { useUserContext } from "../../../context/UserContext"
import useSWR from "swr"
import { getUserById } from "../../../requests/users"
import EditProfileForm from "../../../components/editProfileForm/EditProfileForm"

export default function EditProfile() {
  const {
    user: { id }
  } = useUserContext()

  if (!id) return null

  return <EditProfileGetData userId={id} />
}

interface SWRRequest {
  name: string
  email: string
}

function EditProfileGetData({ userId }: { userId: string }) {
  const { data, isLoading }: { data: SWRRequest; isLoading: boolean } = useSWR(
    `${userId}`,
    getUserById
  )

  if (isLoading) return null
  return <EditProfileForm data={data} userId={userId} />
}
