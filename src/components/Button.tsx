import type { ButtonHTMLAttributes } from "react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  func: () => void
}

const Button = ({ text, type, func }: Props) => {

  return (
    <button
      type={type}
      onClick={() => func()}>
      {text}
    </button>
  )
}

export default Button