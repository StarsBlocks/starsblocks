'use client'

import { useState, useEffect } from 'react'

interface CustomSelectProps {
  id: string
  name: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

export default function CustomSelect({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  disabled = false,
  required = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  const selectedOption = options.find((opt) => opt.value === value)

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest(`#${id}-container`)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    if (isOpen) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [isOpen, id])

  function handleSelect(optValue: string) {
    onChange(optValue)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div className="custom-select" id={`${id}-container`}>
      <input type="hidden" name={name} value={value} required={required} />
      <button
        type="button"
        id={id}
        className={`custom-select__trigger ${disabled ? 'custom-select__trigger--disabled' : ''} ${isOpen ? 'custom-select__trigger--open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={selectedOption ? '' : 'custom-select__placeholder'}>
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className={`custom-select__arrow ${isOpen ? 'custom-select__arrow--open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <path fill="currentColor" d="M6 8L1 3h10z" />
        </svg>
      </button>

      {isOpen && (
        <div className="custom-select__dropdown">
          <input
            type="text"
            className="custom-select__search"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <ul className="custom-select__options">
            {filteredOptions.length === 0 ? (
              <li className="custom-select__option custom-select__option--empty">
                No hay resultados
              </li>
            ) : (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  className={`custom-select__option ${opt.value === value ? 'custom-select__option--selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
