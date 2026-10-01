import promoModel from "../models/promoModel.js"

/* ── ADMIN : créer un code promo ── */
const createPromo = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt, active } = req.body
    if (!code || !discountValue) {
      return res.json({ success: false, message: "Code et valeur de remise obligatoires." })
    }
    const existing = await promoModel.findOne({ code: code.toUpperCase().trim() })
    if (existing) return res.json({ success: false, message: "Ce code existe déjà." })

    const promo = new promoModel({
      code: code.toUpperCase().trim(),
      discountType: discountType || "percent",
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxUses: maxUses ? Number(maxUses) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      active: active !== undefined ? active : true,
    })
    await promo.save()
    res.json({ success: true, message: "Code promo créé.", promo })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/* ── ADMIN : lister tous les codes ── */
const listPromos = async (req, res) => {
  try {
    const promos = await promoModel.find().sort({ createdAt: -1 })
    res.json({ success: true, promos })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

/* ── ADMIN : modifier un code promo ── */
const updatePromo = async (req, res) => {
  try {
    const { id } = req.params
    const promo = await promoModel.findByIdAndUpdate(id, req.body, { new: true })
    if (!promo) return res.json({ success: false, message: "Code introuvable." })
    res.json({ success: true, message: "Code promo mis à jour.", promo })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

/* ── ADMIN : supprimer un code promo ── */
const deletePromo = async (req, res) => {
  try {
    const { id } = req.params
    await promoModel.findByIdAndDelete(id)
    res.json({ success: true, message: "Code promo supprimé." })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

/* ── CLIENT : valider un code promo ── */
const applyPromo = async (req, res) => {
  try {
    const { code, orderAmount } = req.body
    if (!code) return res.json({ success: false, message: "Code requis." })

    const promo = await promoModel.findOne({ code: code.toUpperCase().trim(), active: true })
    if (!promo) return res.json({ success: false, message: "Code promo invalide ou inactif." })

    // Expiration
    if (promo.expiresAt && new Date() > new Date(promo.expiresAt)) {
      return res.json({ success: false, message: "Ce code promo a expiré." })
    }

    // Nombre d'utilisations max
    if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
      return res.json({ success: false, message: "Ce code promo a atteint sa limite d'utilisation." })
    }

    // Montant minimum
    if (orderAmount < promo.minOrderAmount) {
      return res.json({
        success: false,
        message: `Montant minimum requis : ${promo.minOrderAmount} DT`,
      })
    }

    // Calcul réduction
    let discount = 0
    if (promo.discountType === "percent") {
      discount = Math.round((orderAmount * promo.discountValue) / 100)
    } else {
      discount = promo.discountValue
    }
    discount = Math.min(discount, orderAmount) // ne pas dépasser le total

    res.json({
      success: true,
      message: "Code promo appliqué !",
      discount,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      promoId: promo._id,
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export { createPromo, listPromos, updatePromo, deletePromo, applyPromo }
