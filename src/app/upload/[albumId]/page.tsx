'use client'

interface Props {
  params: { albumId: string }
}

export default function UploadSongs(props: Props) {
  const { albumId } = props.params

  return (
    <div>{albumId}</div>
  )
}