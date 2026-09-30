import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Trash2, Search, PackageSearch, Loader2, Star, X, AlertTriangle } from 'lucide-react'

import { BACKEND_URL, COLORS } from '../components/constants'
import { card, field } from '../components/styles'

const colorHex = (name) => COLORS.find((c) => c.name === name)?.hex

/* ---------- Delete confirmation modal ---------- */
const DeleteModal = ({ product, onCancel, onConfirm, deleting }) => {
  useEffect(() => {
    if (!product) return
    const onKey = (e) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [product, onCancel])

  if (!product) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-[#e63946]/10 flex items-center justify-center">
            <AlertTriangle size={20} className="text-[#e63946]" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <h3 className="font-extrabold text-[#1f1f23]">Delete product?</h3>
        <p className="text-sm text-gray-500 mt-1">
          <span className="font-semibold text-gray-700">{product.name}</span> will be permanently removed
          from the catalog.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-3 rounded-xl bg-[#e63946] text-white text-sm font-bold hover:bg-[#d62839] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={15} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Page ---------- */
const ListProducts = ({ token }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/product/list`)
      if (res.data.success) setProducts(res.data.products)
    } catch {
      toast.error('Failed to load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/product/remove`,
        { id: toDelete._id },
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success('Product deleted.')
        setProducts((prev) => prev.filter((p) => p._id !== toDelete._id))
        setToDelete(null)
      } else {
        toast.error(res.data.message)
      }
    } catch {
      toast.error('Error deleting product.')
    } finally {
      setDeleting(false)
    }
  }

  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category))], [products])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      const matchSearch =
        !q || p.name.toLowerCase().includes(q) || p.subCategory?.toLowerCase().includes(q)
      const matchCat = filterCat === 'All' || p.category === filterCat
      return matchSearch && matchCat
    })
  }, [products, search, filterCat])

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-7 h-7 animate-spin text-[#e63946]" />
      </div>
    )

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-[#1f1f23] tracking-tight">Products</h2>
        <p className="text-gray-500 text-sm mt-1 font-medium">
          {products.length} product{products.length !== 1 ? 's' : ''} in catalog
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or brand..."
            className={`${field} !pl-10 !py-2.5 !rounded-full`}
          />
        </div>

        <div className="flex items-center gap-1 bg-white border border-black/5 shadow-sm rounded-full p-1 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filterCat === cat
                  ? 'bg-[#1f1f23] text-white shadow-md'
                  : 'text-gray-500 hover:text-[#1f1f23]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className={`${card} !p-12 text-center`}>
          <div className="w-14 h-14 rounded-2xl bg-[#efefef] flex items-center justify-center mx-auto mb-3">
            <PackageSearch size={22} className="text-gray-400" />
          </div>
          <p className="text-[#1f1f23] font-bold">No products found</p>
          <p className="text-gray-500 text-sm mt-1">Try changing your search or filter.</p>
        </div>
      ) : (
        <div className={`${card} !p-0 overflow-hidden`}>
          {/* Table header (desktop) */}
          <div className="hidden md:grid grid-cols-[64px_1fr_110px_120px_110px_44px] gap-4 px-5 py-3 border-b border-black/5 bg-[#efefef]/60">
            {['Image', 'Product', 'Category', 'Brand', 'Price', ''].map((h) => (
              <span key={h} className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-500">
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((p) => (
            <div
              key={p._id}
              className="grid grid-cols-[64px_1fr_44px] md:grid-cols-[64px_1fr_110px_120px_110px_44px] gap-4 px-5 py-3.5 items-center border-b border-black/5 last:border-0 hover:bg-[#efefef]/40 transition-colors"
            >
              {/* Image */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#efefef] border border-black/5">
                <img src={p.image?.[0]} alt={p.name} className="w-full h-full object-cover" />
              </div>

              {/* Name + badges */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[#1f1f23] text-sm truncate">{p.name}</p>
                  {p.popular && (
                    <Star size={13} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                  )}
                </div>

                {/* Mobile info */}
                <p className="md:hidden text-xs text-gray-500 font-medium mt-0.5">
                  {p.category} · {p.subCategory} ·{' '}
                  <span className="font-bold text-[#1f1f23]">{p.price} TND</span>
                </p>

                <div className="flex gap-1.5 mt-1.5 flex-wrap items-center">
                  {(p.colors || []).slice(0, 4).map((c) => (
                    <span
                      key={c}
                      title={c}
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ background: colorHex(c) || '#d1d5db' }}
                    />
                  ))}
                  {(p.colors || []).length > 4 && (
                    <span className="text-[0.65rem] font-semibold text-gray-500">
                      +{p.colors.length - 4}
                    </span>
                  )}
                  {(p.sizes || []).length > 0 && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-[#e63946]/10 text-[#e63946] text-[0.65rem] font-bold">
                      {p.sizes.length} sizes
                    </span>
                  )}
                </div>
              </div>

              {/* Desktop columns */}
              <span className="hidden md:block text-xs text-gray-600 font-semibold">{p.category}</span>
              <span className="hidden md:block text-xs text-gray-600 font-semibold">{p.subCategory}</span>
              <span className="hidden md:block text-sm font-extrabold text-[#1f1f23]">{p.price} TND</span>

              {/* Delete */}
              <button
                onClick={() => setToDelete(p)}
                aria-label={`Delete ${p.name}`}
                className="w-9 h-9 rounded-xl bg-[#e63946]/10 text-[#e63946] hover:bg-[#e63946] hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <DeleteModal
        product={toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
        deleting={deleting}
      />
    </div>
  )
}

export default ListProducts