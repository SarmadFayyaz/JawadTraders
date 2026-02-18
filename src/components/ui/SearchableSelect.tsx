'use client'

import { useState, useRef, useEffect } from 'react'

export function SearchableSelect({
  name,
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  required,
}: {
  name?: string
  options: { value: string; label: string }[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
}) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const selectedValue = isControlled ? value! : internalValue

  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find((o) => o.value === selectedValue)

  const filteredOptions = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  function handleSelect(optValue: string) {
    if (isControlled) {
      onChange?.(optValue)
    } else {
      setInternalValue(optValue)
    }
    setSearch('')
    setOpen(false)
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={selectedValue} />
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={open ? search : selectedOption?.label || ''}
          onChange={(e) => {
            setSearch(e.target.value)
            if (!open) setOpen(true)
          }}
          onFocus={() => {
            setOpen(true)
            setSearch('')
          }}
          placeholder={placeholder}
          required={required && !selectedValue}
          autoComplete="off"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pe-8 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => {
            setOpen(!open)
            if (!open) {
              setSearch('')
              inputRef.current?.focus()
            }
          }}
          className="absolute end-0 top-0 flex h-full items-center px-2 text-gray-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
          </svg>
        </button>
      </div>
      {open && (
        <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400">—</div>
          ) : (
            filteredOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => handleSelect(o.value)}
                className={`block w-full px-3 py-2 text-start text-sm transition-colors hover:bg-primary-50 ${
                  o.value === selectedValue ? 'bg-primary-50 font-medium text-primary-700' : 'text-gray-700'
                }`}
              >
                {o.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
