interface Props {
  params: { name: string }
}

export default function Profile(props: Props) {
  const { name } = props.params;

  return (
    <div>
      {name}
    </div>
  )
}