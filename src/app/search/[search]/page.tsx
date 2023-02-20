interface Props {
  params: { search: string }
}

export default function Search(props: Props) {
  const { search } = props.params

  return <div>{search}</div>
}
