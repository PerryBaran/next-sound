interface Props {
  params: { albumId: string }
}

export default function EditAlbum(props: Props) {
  const { albumId } = props.params;

  return (
    <div>
      album - {albumId}
    </div>
  )
}