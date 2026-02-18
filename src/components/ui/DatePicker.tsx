'use client'

import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export function DatePicker({
  value,
  onChange,
}: {
  value: string
  onChange: (date: string) => void
}) {
  const selected = value ? new Date(value + 'T00:00:00') : null

  return (
    <ReactDatePicker
      selected={selected}
      onChange={(date: Date | null) => {
        if (date) {
          const yyyy = date.getFullYear()
          const mm = String(date.getMonth() + 1).padStart(2, '0')
          const dd = String(date.getDate()).padStart(2, '0')
          onChange(`${yyyy}-${mm}-${dd}`)
        }
      }}
      dateFormat="yyyy-MM-dd"
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      wrapperClassName="date-picker-wrapper"
      popperPlacement="bottom-start"
    />
  )
}
