"use client"

import { useUserContext } from "@/context/UserContext"
import Link from "next/link"

interface Props {
  userId: string
}

export default function EditProfileButton({ userId }: Props) {
  const {
    user: { id }
  } = useUserContext()

  if (id !== userId) return null

  return <Link href={`/edit/profile`}>Edit Profile</Link>
}
