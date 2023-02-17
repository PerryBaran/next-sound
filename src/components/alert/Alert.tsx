export default function Alert({ 
  message 
  }: {
    message: string
  }) {
    if (!message) return null

  return (
    <p>{message}</p>
  )
}