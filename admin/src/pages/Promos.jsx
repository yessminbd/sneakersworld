import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Tag, Plus, Trash2, ToggleLeft, ToggleRight, Pencil, X, Check, Percent, DollarSign, Clock, Users, ChevronDown } from "lucide-react"

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"

const emptyForm = {
  code: "", discountType: "percent", discountValue: "", minOrderAmount: "",
  maxUses: "", expiresAt: "", active: true,
}

export default function Promos({ token }) {
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchPromos = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/promo/list`, { headers: { token } })
      const data = await res.json()
      if (data.success) setPromos(data.promos)
    } catch { toast.error("Erreur chargement") }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchPromos() }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.code.trim() || !form.discountValue) { toast.error("Code et valeur obligatoires"); return }
    setSaving(true)
    try {
      const url = editId
        ? `${backendUrl}/api/promo/update/${editId}`
        : `${backendUrl}/api/promo/create`
      const method = editId ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({
          ...form,
          discountValue: Number(form.discountValue),
          minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
          maxUses: form.maxUses ? Number(form.maxUses) : null,
          expiresAt: form.expiresAt || null,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(editId ? "Code mis à jour !" : "Code créé !")
        setShowForm(false); setForm(emptyForm); setEditId(null)
        fetchPromos()
      } else {
        toast.error(data.message)
      }
    } catch { toast.error("Erreur serveur") }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce code promo ?")) return
    try {
      const res = await fetch(`${backendUrl}/api/promo/delete/${id}`, {
        method: "DELETE", headers: { token }
      })
      const data = await res.json()
      if (data.success) { toast.success("Supprimé !"); fetchPromos() }
      else toast.error(data.message)
    } catch { toast.error("Erreur") }
  }

  const handleToggle = async (promo) => {
    try {
      const res = await fetch(`${backendUrl}/api/promo/update/${promo._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ active: !promo.active }),
      })
      const data = await res.json()
      if (data.success) fetchPromos()
      else toast.error(data.message)
    } catch { toast.error("Erreur") }
  }

  const handleEdit = (promo) => {
    setForm({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      minOrderAmount: promo.minOrderAmount || "",
      maxUses: promo.maxUses ?? "",
      expiresAt: promo.expiresAt ? new Date(promo.expiresAt).toISOString().split("T")[0] : "",
      active: promo.active,
    })
    setEditId(promo._id)
    setShowForm(true)
  }

  const isExpired = (p) => p.expiresAt && new Date() > new Date(p.expiresAt)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-primary">Codes Promo</h1>
            <p className="text-xs text-gray-50">{promos.length} code{promos.length !== 1 ? "s" : ""} au total</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm) }}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-secondary transition-all shadow-md"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Annuler" : "Nouveau code"}
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-10 shadow-md p-6 mb-8">
          <h2 className="text-base font-black text-primary mb-5">
            {editId ? "Modifier le code promo" : "Créer un code promo"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-50 uppercase tracking-wide">Code <span className="text-red-500">*</span></label>
              <input name="code" value={form.code} onChange={handleChange} required disabled={!!editId}
                placeholder="SUMMER20" maxLength={20}
                className="px-4 py-3 rounded-xl border border-gray-10 bg-primaryLight text-primary text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all placeholder:normal-case placeholder:font-normal" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-50 uppercase tracking-wide">Type de remise <span className="text-red-500">*</span></label>
              <div className="relative">
                <select name="discountType" value={form.discountType} onChange={handleChange}
                  className="w-full appearance-none px-4 py-3 rounded-xl border border-gray-10 bg-primaryLight text-primary text-sm font-medium focus:outline-none focus:border-primary transition-all pr-10">
                  <option value="percent">Pourcentage (%)</option>
                  <option value="fixed">Montant fixe (DT)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-30 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-50 uppercase tracking-wide">
                Valeur {form.discountType === "percent" ? "(%)" : "(DT)"} <span className="text-red-500">*</span>
              </label>
              <input name="discountValue" type="number" min="1" max={form.discountType === "percent" ? 100 : undefined}
                value={form.discountValue} onChange={handleChange} required placeholder={form.discountType === "percent" ? "20" : "50"}
                className="px-4 py-3 rounded-xl border border-gray-10 bg-primaryLight text-primary text-sm font-medium focus:outline-none focus:border-primary transition-all placeholder:text-gray-30" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-50 uppercase tracking-wide">Montant minimum (DT)</label>
              <input name="minOrderAmount" type="number" min="0" value={form.minOrderAmount} onChange={handleChange}
                placeholder="0"
                className="px-4 py-3 rounded-xl border border-gray-10 bg-primaryLight text-primary text-sm font-medium focus:outline-none focus:border-primary transition-all placeholder:text-gray-30" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-50 uppercase tracking-wide">Utilisations max</label>
              <input name="maxUses" type="number" min="1" value={form.maxUses} onChange={handleChange}
                placeholder="Illimité"
                className="px-4 py-3 rounded-xl border border-gray-10 bg-primaryLight text-primary text-sm font-medium focus:outline-none focus:border-primary transition-all placeholder:text-gray-30" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-50 uppercase tracking-wide">Date d&apos;expiration</label>
              <input name="expiresAt" type="date" value={form.expiresAt} onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-gray-10 bg-primaryLight text-primary text-sm font-medium focus:outline-none focus:border-primary transition-all" />
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <input id="active" name="active" type="checkbox" checked={form.active} onChange={handleChange}
                className="w-4 h-4 accent-primary" />
              <label htmlFor="active" className="text-sm font-semibold text-primary cursor-pointer">Code actif</label>
            </div>
          </div>

          <div className="flex gap-3 mt-6 justify-end">
            <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); setEditId(null) }}
              className="px-6 py-2.5 rounded-xl border-2 border-gray-10 text-primary font-bold text-sm hover:bg-gray-10 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm flex items-center gap-2 hover:bg-secondary transition-all disabled:opacity-70">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
              {editId ? "Mettre à jour" : "Créer le code"}
            </button>
          </div>
        </form>
      )}

      {/* Liste */}
      {loading ? (
        <div className="text-center py-20 text-gray-50">Chargement…</div>
      ) : promos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-10">
          <Tag className="w-10 h-10 text-gray-20 mx-auto mb-3" />
          <p className="text-gray-50 font-semibold">Aucun code promo créé</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {promos.map((promo) => {
            const expired = isExpired(promo)
            return (
              <div key={promo._id}
                className={`bg-white rounded-2xl border shadow-sm p-4 flex flex-wrap items-center gap-4 transition-all
                  ${!promo.active || expired ? "opacity-60 border-gray-10" : "border-gray-10 hover:shadow-md"}`}>

                {/* Code badge */}
                <div className="flex items-center gap-2 min-w-[120px]">
                  <span className={`px-3 py-1.5 rounded-lg font-black text-sm tracking-wider
                    ${promo.active && !expired ? "bg-primary text-white" : "bg-gray-10 text-gray-50"}`}>
                    {promo.code}
                  </span>
                  {expired && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Expiré</span>}
                </div>

                {/* Remise */}
                <div className="flex items-center gap-1.5 text-sm font-bold text-primary">
                  {promo.discountType === "percent"
                    ? <><Percent className="w-4 h-4" />{promo.discountValue}% de remise</>
                    : <><DollarSign className="w-4 h-4" />{promo.discountValue} DT de remise</>}
                </div>

                {/* Infos */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-50 flex-1">
                  {promo.minOrderAmount > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="font-semibold text-primary">Min:</span> {promo.minOrderAmount} DT
                    </span>
                  )}
                  {promo.maxUses !== null && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {promo.usedCount}/{promo.maxUses}
                    </span>
                  )}
                  {promo.expiresAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {new Date(promo.expiresAt).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-auto">
                  <button onClick={() => handleToggle(promo)} title={promo.active ? "Désactiver" : "Activer"}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-10 transition-colors">
                    {promo.active
                      ? <ToggleRight className="w-5 h-5 text-primary" />
                      : <ToggleLeft className="w-5 h-5 text-gray-30" />}
                  </button>
                  <button onClick={() => handleEdit(promo)} title="Modifier"
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-10 transition-colors">
                    <Pencil className="w-4 h-4 text-gray-50" />
                  </button>
                  <button onClick={() => handleDelete(promo._id)} title="Supprimer"
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
