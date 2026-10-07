import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Save, Loader2, ArrowLeft, Trash2 } from 'lucide-react'

import { BACKEND_URL } from '../components/constants'
import { useLocalList } from '../hooks/useLocalList'
import { card, sectionTitle, label, field } from '../components/styles'
import ImageUpload from '../components/ImageUpload'
import BrandSelector from '../components/BrandSelector'
import ColorPicker from '../components/ColorPicker'
import SizeSelector from '../components/SizeSelector'

// ── Helpers (no hardcoded data) ─────────────────────────────────
// Normalizes values that may be an array, a JSON string, a single value or empty
const toArray = (value) => {
  if (Array.isArray(value)) return value
  if (!value) return []
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : [value]
    } catch {
      return [value]
    }
  }
  return [value]
}

const colorName = (c) => (c && typeof c === 'object' ? c.name : c)

const uniq = (arr) => {
  const seen = new Set()
  return arr.filter((v) => {
    if (v === undefined || v === null || v === '') return false
    const key = String(v).toLowerCase().trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const sortNatural = (arr) =>
  [...arr].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }))

const EditProduct = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [catalog, setCatalog] = useState([]) // all products, used to build the options
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)

  // Form fields (empty until the product is loaded)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [subCategory, setSubCategory] = useState('')
  const [popular, setPopular] = useState(false)

  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([null, null, null, null])

  // Custom entries added by the admin (stored locally), no built-in defaults
  const [customBrands, addBrand] = useLocalList('customBrands', [])
  const [customSizes, addSize] = useLocalList('customSizes', [])
  const [customColors, addColor] = useLocalList('customColors', [], (c) => c.name.toLowerCase())

  // Fetch the product being edited
  useEffect(() => {
    const fetchProduct = async () => {
      setFetching(true)
      try {
        const res = await axios.get(`${BACKEND_URL}/api/product/single?productId=${id}`)
        if (res.data.success && res.data.product) {
          const p = res.data.product
          setName(p.name || '')
          setDescription(p.description || '')
          setPrice(p.price ?? '')
          setSelectedCategories(toArray(p.category))
          setSubCategory(p.subCategory || '')
          setPopular(Boolean(p.popular))
          setSelectedSizes(toArray(p.sizes))
          setSelectedColors(toArray(p.colors).map(colorName).filter(Boolean))
          setExistingImages(toArray(p.image))
        } else {
          toast.error('Product not found')
          navigate('/list')
        }
      } catch (err) {
        toast.error('Failed to load product details.')
        navigate('/list')
      } finally {
        setFetching(false)
      }
    }
    fetchProduct()
  }, [id, navigate])

  // Fetch all products to build dynamic options (brands, categories, sizes, colors)
  useEffect(() => {
    let cancelled = false
    axios
      .get(`${BACKEND_URL}/api/product/list`)
      .then((res) => {
        if (!cancelled && res.data.success) setCatalog(res.data.products || [])
      })
      .catch(() => {
        // Non-blocking: the form still works with the product's own values
      })
    return () => {
      cancelled = true
    }
  }, [])

  // ── Dynamic options ───────────────────────────────────────────
  const categories = useMemo(
    () =>
      sortNatural(
        uniq([...catalog.flatMap((p) => toArray(p.category)), ...selectedCategories])
      ),
    [catalog, selectedCategories]
  )

  const brands = useMemo(
    () =>
      sortNatural(
        uniq([
          ...catalog.map((p) => p.subCategory?.trim()),
          ...toArray(customBrands),
          subCategory,
        ])
      ),
    [catalog, customBrands, subCategory]
  )

  const sizes = useMemo(
    () =>
      sortNatural(
        uniq([
          ...catalog.flatMap((p) => toArray(p.sizes)),
          ...toArray(customSizes),
          ...selectedSizes,
        ])
      ),
    [catalog, customSizes, selectedSizes]
  )

  const colors = useMemo(() => {
    // Keep full color objects (name + any extra data) when available
    const byName = new Map()
    const register = (c) => {
      const n = colorName(c)
      if (!n) return
      const key = String(n).toLowerCase().trim()
      const existing = byName.get(key)
      // Prefer richer objects over plain names
      if (!existing || (typeof c === 'object' && typeof existing !== 'object')) {
        byName.set(key, typeof c === 'object' ? c : { name: n })
      }
    }
    catalog.forEach((p) => toArray(p.colors).forEach(register))
    toArray(customColors).forEach(register)
    selectedColors.forEach(register)
    return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [catalog, customColors, selectedColors])

  // ── Handlers ──────────────────────────────────────────────────
  const toggle = (setter) => (item) =>
    setter((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))

  const setNewImageAt = (index) => (file) =>
    setNewImages((prev) => prev.map((img, i) => (i === index ? file : img)))

  const removeExistingImage = (imgUrl) => {
    setExistingImages((prev) => prev.filter((url) => url !== imgUrl))
  }

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

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (selectedCategories.length === 0) return toast.error('Select at least one category.')
    if (!subCategory) return toast.error('Select a brand.')
    if (selectedSizes.length === 0) return toast.error('Select at least one size.')
    if (selectedColors.length === 0) return toast.error('Select at least one color.')
    if (existingImages.length === 0 && !newImages.some(Boolean)) {
      return toast.error('Product must have at least one image.')
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('id', id)
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', JSON.stringify(selectedCategories))
      formData.append('subCategory', subCategory)
      formData.append('sizes', JSON.stringify(selectedSizes))
      formData.append('colors', JSON.stringify(selectedColors))
      formData.append('popular', popular ? 'true' : 'false')
      formData.append('existingImages', JSON.stringify(existingImages))

      newImages.forEach((img, i) => {
        if (img) formData.append(`image${i + 1}`, img)
      })

      const { data } = await axios.post(`${BACKEND_URL}/api/product/update`, formData, {
        headers: { token },
      })

      if (data.success) {
        toast.success('Product updated successfully!')
        navigate('/list')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error('Failed to update product.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#e63946]" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to="/list"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#e63946] mb-2 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Products
          </Link>
          <h2 className="text-2xl font-extrabold text-[#1f1f23] tracking-tight">Edit Product</h2>
          <p className="text-gray-500 text-sm mt-0.5 font-medium">
            Update details for <span className="font-bold text-gray-800">{name}</span>
          </p>
        </div>
      </div>

      <form onSubmit={onSubmitHandler} className="space-y-6">
        {/* Images */}
        <div className={card}>
          <h3 className={sectionTitle}>Product Images</h3>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-600 mb-2">Current Photos</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {existingImages.map((url, i) => (
                  <div
                    key={url}
                    className="relative group aspect-square rounded-2xl overflow-hidden border border-black/10 bg-[#efefef]"
                  >
                    <img src={url} alt={`Existing ${i + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="w-8 h-8 rounded-full bg-white text-[#e63946] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-md"
                        title="Remove image"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          <div>
            <p className="text-xs font-bold text-gray-600 mb-2">Add New Photos</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {newImages.map((img, i) => (
                <ImageUpload
                  key={i}
                  img={img}
                  setImg={setNewImageAt(i)}
                  text={`New Photo ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className={`${card} space-y-4`}>
          <h3 className={sectionTitle}>Product Details</h3>
          <div>
            <label className={label}>Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
              className={field}
            />
          </div>
        </div>

        {/* Category & Brand */}
        <div className={card}>
          <h3 className={sectionTitle}>Category & Brand</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Categories</label>
              <div className="flex gap-2 flex-wrap">
                {categories.length === 0 && (
                  <span className="text-xs text-gray-400">No categories available.</span>
                )}
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCategory(c)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedCategories.includes(c)
                        ? 'bg-[#1f1f23] text-white border-[#1f1f23]'
                        : 'bg-white text-gray-700 border-black/10 hover:border-black/30'
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
              Show this product in the Popular section on the frontend.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={popular}
            onClick={() => setPopular(!popular)}
            className={`relative flex-shrink-0 w-12 h-7 rounded-full transition-colors duration-300 cursor-pointer ${
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
          className="w-full bg-[#1f1f23] text-white font-bold py-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 text-base shadow-lg disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Saving changes...
            </>
          ) : (
            <>
              <Save size={18} /> Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default EditProduct