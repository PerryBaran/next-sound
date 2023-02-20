interface Props {
  params: { userId: string }
}

export default function EditProfile(props: Props) {
  const { userId } = props.params

  return <div>profile - {userId}</div>
}
