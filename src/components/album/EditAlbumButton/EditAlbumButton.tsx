"use client"

import Link from "next/link"
import { useUserContext } from "../../../context/UserContext"

interface Props {
  albumId: string
  albumUserId: string
  profile: boolean
}

export default function EditAlbumButton({
  albumId,
  albumUserId,
  profile
}: Props) {
  const {
    user: { id }
  } = useUserContext()

  if (!profile || albumUserId !== id) return null

  return <Link href={`/edit/album/${albumId}`}>Edit Album</Link>
}
