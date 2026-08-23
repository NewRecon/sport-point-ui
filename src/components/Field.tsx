import type { InputHTMLAttributes } from "react"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  placeholder: string
  func: (query: string) => void
}

const Field = ({ label, type, placeholder, func }: Props) => {

  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        onInput={(event) => func(event.currentTarget.value)} />
    </div>
  )
}

export default Field