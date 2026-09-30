import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { label, field } from './styles'
import BrandModal from './BrandModal'

const BrandSelector = ({ brands, value, onChange, onAdd }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleSave = (name) => {
    onAdd(name)
    onChange(name)
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className={`${label} !mb-0`}>Brand</label>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 text-xs font-bold text-[#e63946] hover:underline"
        >
          <Plus size={13} /> Add new
        </button>
      </div>

      <select value={value} onChange={(e) => onChange(e.target.value)} className={field}>
        {brands.map((b) => (
          <option key={b}>{b}</option>
        ))}
      </select>

      <BrandModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        existing={brands}
      />
    </div>
  )
}

export default BrandSelector