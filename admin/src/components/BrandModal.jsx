import React, { useState, useEffect } from 'react'
import { X, Tag } from 'lucide-react'
import { label, field } from './styles'

const BrandModal = ({ open, onClose, onSave, existing }) => {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setValue('')
      setError('')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const submit = () => {
    const name = value.trim()
    if (!name) return setError('Please enter a brand name.')
    if (name.length > 30) return setError('Brand name is too long (30 characters max).')
    if (existing.some((b) => b.toLowerCase() === name.toLowerCase()))
      return setError('This brand already exists.')
    onSave(name)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#e63946]/10 flex items-center justify-center">
              <Tag size={20} className="text-[#e63946]" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#1f1f23] leading-tight">New Brand</h3>
              <p className="text-xs text-gray-500 mt-0.5">Add a brand to the list.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <label className={label}>Brand Name</label>
        <input
          autoFocus
          type="text"
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
          placeholder="e.g. Asics"
          className={`${field} ${error ? 'border-red-400 focus:border-red-500' : ''}`}
        />
        {error && <p className="text-xs text-red-500 font-medium mt-1.5">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="flex-1 py-3 rounded-xl bg-[#e63946] text-white text-sm font-bold hover:bg-[#d62839] transition-colors shadow-sm"
          >
            Add Brand
          </button>
        </div>
      </div>
    </div>
  )
}

export default BrandModal