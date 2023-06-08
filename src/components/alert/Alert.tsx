import css from "./alert.module.css"

export default function Alert({ message }: { message: string }) {
  if (!message) return null

  return <p className={css["alert"]}>{message}</p>
}
