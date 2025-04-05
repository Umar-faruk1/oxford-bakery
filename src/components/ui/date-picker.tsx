import { forwardRef } from "react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Input } from "./input"

interface DatePickerProps {
  selected: Date | null
  onChange: (date: Date | null) => void
  placeholderText?: string
}

export const DatePicker = forwardRef<ReactDatePicker, DatePickerProps>(
  ({ selected, onChange, placeholderText }, ref) => {
    return (
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        customInput={<Input />}
        placeholderText={placeholderText}
        ref={ref}
      />
    )
  }
)

DatePicker.displayName = "DatePicker" 