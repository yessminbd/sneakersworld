import React, { useMemo, useEffect } from 'react'
import { X, Image as ImageIcon } from 'lucide-react'

const ImageUpload = ({ img, setImg, text }) => {
  const preview = useMemo(() => (img ? URL.createObjectURL(img) : null), [img])
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview])

  return (
    <label
      className={`relative group flex flex-col items-center justify-center aspect-square rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ${
        img
          ? 'border border-black/5'
          : 'border-2 border-dashed border-gray-300 bg-[#efefef] hover:border-[#e63946]/50 hover:bg-[#e63946]/[0.04]'
      }`}
    >
      {img ? (
        <>
          <img src={preview} className="w-full h-full object-cover" alt="preview" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setImg(null)
              }}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <X size={16} className="text-[#e63946]" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 px-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-[#e63946]/10 transition-colors">
            <ImageIcon size={18} className="text-gray-400 group-hover:text-[#e63946] transition-colors" />
          </div>
          <span className="text-xs text-gray-500 font-medium">{text}</span>
        </div>
      )}
      <input type="file" className="hidden" accept="image/*" onChange={(e) => setImg(e.target.files[0] || null)} />
    </label>
  )
}

export default ImageUpload