import mongoose from "mongoose"

const promoSchema = new mongoose.Schema({
  code:        { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ["percent", "fixed"], required: true, default: "percent" },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxUses:     { type: Number, default: null },     // null = illimité
  usedCount:   { type: Number, default: 0 },
  expiresAt:   { type: Date, default: null },        // null = pas d'expiration
  active:      { type: Boolean, default: true },
}, { timestamps: true })

const promoModel = mongoose.models.promo || mongoose.model("promo", promoSchema)
export default promoModel
