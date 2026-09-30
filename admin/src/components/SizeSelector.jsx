import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { card, sectionTitle, label, field, chip } from './styles'

const MIN_SIZE = 20
const MAX_SIZE = 60

const SizeSelector = ({ sizes, selected, onToggle, onAdd }) => {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const sorted = [...sizes].sort((a, b) => parseFloat(a) - parseFloat(b))

  const submit = () => {
    const size = value.trim().replace(',', '.')
    const num = parseFloat(size)

    if (!size) return setError('Enter a size.')
    if (isNaN(num) || num < MIN_SIZE || num > MAX_SIZE)
      return setError(`Size must be between ${MIN_SIZE} and ${MAX_SIZE}.`)
    if (sizes.includes(String(num))) return setError('This size already exists.')

    onAdd(String(num))
    setValue('')
    setError('')
  }

  return (
    <div className={card}>
      <h3 className={sectionTitle}>Available Sizes (EU)</h3>

      <div className="flex flex-wrap gap-2">
        {sorted.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onToggle(size)}
            className={`min-w-[3rem] h-12 px-2 rounded-xl text-sm font-bold border transition-all duration-200 ${chip(
              selected.includes(size)
            )}`}
          >
            {size}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <p className="text-xs text-gray-500 mt-3 font-medium">Selected: {selected.join(', ')}</p>
      )}

      {/* Add custom size */}
      <div className="mt-5 pt-5 border-t border-black/5">
        <label className={label}>Add a custom size</label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            step="0.5"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                submit()
              }
            }}
            placeholder="e.g. 47 or 35.5"
            className={`${field} ${error ? 'border-red-400 focus:border-red-500' : ''}`}
          />
          <button
            type="button"
            onClick={submit}
            className="flex items-center gap-1.5 px-4 h-12 rounded-xl bg-[#1f1f23] text-white text-sm font-bold hover:bg-black transition-colors flex-shrink-0"
          >
            <Plus size={15} /> Add
          </button>
        </div>
        {error && <p className="text-xs text-red-500 font-medium mt-1.5">{error}</p>}
      </div>
    </div>
  )
}

export default SizeSelector