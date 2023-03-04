'use client'

import { useState } from "react"
import Alert from "@/components/alert/Alert"

interface Props {
  params: { albumId: string }
}

interface Songs {
  name: string,
  audio?: File,
  key: string
}

export default function UploadSongs(props: Props) {
  const { albumId } = props.params
  const [songs, setSongs] = useState<Songs[]>([{
    name: "",
    audio: undefined,
    key: crypto.randomUUID()
  }])
  const [alert, setAlert] = useState("")

  return (
    <div>{albumId}</div>
  )
}