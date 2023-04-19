"use client"

import useSWR from "swr"
import { getAlbumById } from "../../../../requests/albums"
import UploadAlbumForm from "../../../../components/uploadAlbumForm/UploadAlbumForm"

interface Props {
  params: { albumId: string }
}

interface SWRRequest {
  name: string
  id: string
  Songs: {
    name: string
    position: number
    id: string
  }[]
}

export default function EditAlbum(props: Props) {
  const { albumId } = props.params
  const { data, isLoading }: { data: SWRRequest; isLoading: boolean } = useSWR(
    `${albumId}`,
    getAlbumById
  )
  return isLoading ? null : <UploadAlbumForm data={data} />
}
