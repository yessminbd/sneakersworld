import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Upload, Loader2 } from 'lucide-react'

import { useLocalList } from '../hooks/useLocalList'
import { BACKEND_URL, CATEGORIES, BRANDS, SIZES, COLORS } from '../components/constants.js'
import { card, sectionTitle, label, field } from '../components/styles.js'
import ImageUpload from '../components/ImageUpload.jsx'
import BrandSelector from '../components/BrandSelector.jsx'
import ColorPicker from '../components/ColorPicker.jsx'
import SizeSelector from '../components/SizeSelector.jsx'

const IMAGE_LABELS = ['Main Photo', 'Photo 2', 'Photo 3', 'Photo 4']

const AddProduct = ({ token }) => {
  // Form fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(['Men'])
  const [subCategory, setSubCategory] = useState('Nike')
  const [popular, setPopular] = useState(false)
  const [images, setImages] = useState([null, null, null, null])
  const [loading, setLoading] = useState(false)

  // Selections
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])

  // Lists (defaults + custom saved in localStorage)
  const [brands, addBrand] = useLocalList('customBrands', BRANDS)
  const [sizes, addSize] = useLocalList('customSizes', SIZES)
  const [colors, addColor] = useLocalList('customColors', COLORS, (c) => c.name.toLowerCase())

  // Helpers
  const toggle = (setter) => (item) =>
    setter((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))

  const setImageAt = (index) => (file) =>
    setImages((prev) => prev.map((img, i) => (i === index ? file : img)))

  const handleAddColor = (color) => {
    addColor(color)
    setSelectedColors((prev) => [...prev, color.name])
    toast.success(`Color "${color.name}" added.`)
  }

  const handleAddSize = (size) => {
    addSize(size)
    setSelectedSizes((prev) => [...prev, size])
    toast.success(`Size ${size} added.`)
  }

  const handleAddBrand = (brand) => {
    addBrand(brand)
    toast.success(`Brand "${brand}" added.`)
  }

  const toggleCategory = (cat) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )

  const resetForm = () => {
    setName('')
    setDescription('')
    setPrice('')
    setSelectedCategories(['Men'])
    setSelectedSizes([])
    setSelectedColors([])
    setImages([null, null, null, null])
    setPopular(false)
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (selectedCategories.length === 0) return toast.error('Select at least one category.')
    if (selectedSizes.length === 0) return toast.error('Select at least one size.')
    if (selectedColors.length === 0) return toast.error('Select at least one color.')
    if (!images[0]) return toast.error('Add at least one image.')

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', JSON.stringify(selectedCategories))
      formData.append('subCategory', subCategory)
      formData.append('sizes', JSON.stringify(selectedSizes))
      formData.append('colors', JSON.stringify(selectedColors))
      formData.append('popular', popular ? 'true' : 'false')
      images.forEach((img, i) => img && formData.append(`image${i + 1}`, img))

      const { data } = await axios.post(`${BACKEND_URL}/api/product/add`, formData, {
        headers: { token },
      })

      if (data.success) {
        toast.success('Product added successfully!')
        resetForm()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error('Server error.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-gray-500 text-sm mt-1 font-medium">
          Fill in the details to add a new sneaker to the catalog.
        </p>
      </div>

      <form onSubmit={onSubmitHandler} className="space-y-5">
        {/* Images */}
        <div className={card}>
          <h3 className={sectionTitle}>Product Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <ImageUpload key={i} img={img} setImg={setImageAt(i)} text={IMAGE_LABELS[i]} />
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className={`${card} space-y-4`}>
          <h3 className={sectionTitle}>Product Info</h3>
          <div>
            <label className={label}>Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Nike Air Max 90"
              className={field}
            />
          </div>
          <div>
            <label className={label}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Describe the product..."
              className={`${field} resize-none`}
            />
          </div>
          <div>
            <label className={label}>Price (TND)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              placeholder="120"
              className={field}
            />
          </div>
        </div>

        {/* Category & Brand */}
        <div className={card}>
          <h3 className={sectionTitle}>Category & Brand</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Category</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCategory(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedCategories.includes(c)
                        ? 'bg-[#1f1f23] text-white border-[#1f1f23]'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <BrandSelector
              brands={brands}
              value={subCategory}
              onChange={setSubCategory}
              onAdd={handleAddBrand}
            />
          </div>
        </div>

        {/* Colors */}
        <ColorPicker
          colors={colors}
          selected={selectedColors}
          onToggle={toggle(setSelectedColors)}
          onAdd={handleAddColor}
        />

        {/* Sizes */}
        <SizeSelector
          sizes={sizes}
          selected={selectedSizes}
          onToggle={toggle(setSelectedSizes)}
          onAdd={handleAddSize}
        />

        {/* Popular toggle */}
        <div className={`${card} flex items-center justify-between gap-4`}>
          <div>
            <p className="font-bold text-[#1f1f23] text-sm">Mark as Popular</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Show this product in the Popular section on the homepage.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={popular}
            onClick={() => setPopular(!popular)}
            className={`relative flex-shrink-0 w-12 h-7 rounded-full transition-colors duration-300 ${
              popular ? 'bg-[#e63946]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                popular ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#e63946] text-white font-bold py-4 rounded-2xl hover:bg-[#d62839] transition-all duration-300 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 text-base shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Adding product...
            </>
          ) : (
            <>
              <Upload size={18} /> Add Product
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default AddProduct