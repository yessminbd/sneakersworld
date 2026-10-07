import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import {
  ArrowLeft, ArrowRight, CheckCircle2, MapPin, Phone, User,
  Truck, CreditCard, Banknote, ShoppingBag, X, Package,
  ShieldCheck, Clock, AlertCircle, Tag, Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLang } from "../context/LangContext";

/* ─────────────────────────────────────────────
   Tunisia's 24 governorates
───────────────────────────────────────────── */
const TUNISIA_GOVERNORATES = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa",
  "Jendouba", "Kairouan", "Kasserine", "Kébili", "Le Kef", "Mahdia",
  "La Manouba", "Médenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid",
  "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan",
];

/* ─────────────────────────────────────────────
   Order confirmation modal
───────────────────────────────────────────── */
function ConfirmOrderModal({ isOpen, onClose, onConfirm, cartData, products, subtotal, delivery_fee, currency, formData, paymentMethod, loading, discount, promoCode, t }) {
  const total = subtotal === 0 ? 0 : Math.max(0, subtotal - discount) + delivery_fee;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-[slideUp_0.35s_cubic-bezier(.16,1,.3,1)_both]">

        <div className="bg-primary px-6 pt-6 pb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="confirm-modal-title" className="text-lg font-black text-white">{t.confirmOrder}</h2>
              <p className="text-white/60 text-xs mt-0.5">{t.reviewBeforeConfirm}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label={t.close} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5 max-h-[65vh] overflow-y-auto">

          {/* Delivery destination */}
          <div className="rounded-2xl border border-gray-10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wide">{t.delivery}</span>
            </div>
            <p className="font-bold text-primary text-sm">{formData.firstName} {formData.lastName}</p>
            <p className="text-gray-50 text-sm mt-0.5">{formData.street}{formData.city ? `, ${formData.city}` : ""}{formData.state ? ` ${formData.state}` : ""}</p>
            {formData.phone && <p className="text-gray-50 text-sm">{formData.phone}</p>}
          </div>

          {/* Items */}
          <div className="rounded-2xl border border-gray-10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wide">{t.items} ({cartData.reduce((s, i) => s + i.quantity, 0)})</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {cartData.map((item) => {
                const p = products.find((pr) => pr._id === item._id);
                if (!p) return null;
                const img = Array.isArray(p.image) ? p.image[0] : p.image;
                return (
                  <div key={`${item._id}-${item.size}-${item.color || "std"}`} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-10 flex-shrink-0">
                      <img src={img} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary line-clamp-1">{p.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-gray-50">{t.sizeLabel} {item.size}</span>
                        {item.color && <span className="text-xs text-gray-50">· {item.color}</span>}
                        <span className="text-xs text-gray-50">· x{item.quantity}</span>
                      </div>
                    </div>
                    <p className="text-sm font-black text-primary flex-shrink-0">{p.price * item.quantity} {currency}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recap */}
          <div className="rounded-2xl border border-gray-10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wide">{t.recap}</span>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-gray-50">
                <span>{t.subtotal}</span>
                <span className="text-primary font-semibold">{subtotal} {currency}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {t.promoDiscount} {promoCode}</span>
                  <span className="font-semibold">- {discount} {currency}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-50">
                <span>{t.shippingFee}</span>
                <span className="text-primary font-semibold">{delivery_fee === 0 ? t.freeShipping : `${delivery_fee} ${currency}`}</span>
              </div>
              <div className="flex justify-between text-gray-50">
                <span>{t.paymentMethod}</span>
                <span className="text-primary font-semibold">{paymentMethod === "cod" ? t.cashOnDelivery : t.stripe}</span>
              </div>
              <hr className="border-gray-10 my-1" />
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-primary">{t.total}</span>
                <span className="font-black text-2xl text-primary">{total} {currency}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">{t.confirmNote}</p>
          </div>
        </div>

        <div className="px-6 pb-6 pt-3 flex flex-col sm:flex-row gap-3">
          <button onClick={onClose} disabled={loading} className="flex-1 py-3.5 rounded-xl border-2 border-gray-10 text-primary font-bold text-sm hover:bg-gray-10 transition-colors disabled:opacity-50">
            {t.modify}
          </button>
          <button
            id="confirm-order-btn"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3.5 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-secondary active:scale-95 transition-all disabled:opacity-70 shadow-lg shadow-primary/30"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t.processing}</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" />{t.confirmBtn}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PlaceOrder page (Checkout)
───────────────────────────────────────────── */
export default function PlaceOrder() {
  const { products, currency, cartItems, getCartAmount, delivery_fee, token, backendUrl, setCartItems } = useContext(ShopContext);
  const { t, lang } = useLang();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=place-order');
    }
  }, [token, navigate]);

  const [cartData, setCartData] = useState([]);
  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        const val = cartItems[items][item];
        if (typeof val === "number" && val > 0) {
          tempData.push({ _id: items, size: item, color: null, quantity: val });
        } else if (typeof val === "object" && val !== null) {
          for (const col in val) {
            if (val[col] > 0) {
              tempData.push({ _id: items, size: item, color: col !== "Standard" ? col : null, quantity: val[col] });
            }
          }
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", street: "", city: "", state: "", zipCode: "", country: "Tunisia", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Promo code
  const [promoCode, setPromoCode] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoLoading, setPromoLoading] = useState(false);

  const subtotal = getCartAmount();
  const discountedSubtotal = Math.max(0, subtotal - promoDiscount);
  const total = subtotal === 0 ? 0 : discountedSubtotal + delivery_fee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Uniquement des chiffres, max 8
      const cleaned = value.replace(/\D/g, "").slice(0, 8);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      return;
    }
    if (name === "zipCode") {
      // Uniquement des chiffres, max 4
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    if (!token) { toast.error(t.loginForPromo); return; }
    setPromoLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/promo/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ code: promoInput.trim(), orderAmount: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setPromoDiscount(data.discount);
        setPromoCode(promoInput.trim().toUpperCase());
        toast.success(data.message);
      } else {
        toast.error(data.message);
        setPromoDiscount(0);
        setPromoCode("");
      }
    } catch { toast.error(t.verifyError); }
    finally { setPromoLoading(false); }
  };

  const handleRemovePromo = () => {
    setPromoDiscount(0);
    setPromoCode("");
    setPromoInput("");
  };

  const handleProceed = (e) => {
    e.preventDefault();
    if (cartData.length === 0) { toast.error(t.cartEmptyError); return; }
    const required = ["firstName", "lastName", "street", "city", "phone"];
    for (const field of required) {
      if (!formData[field].trim()) { toast.error(t.fillAllFields); return; }
    }

    // Validation du numéro de téléphone (exactement 8 chiffres)
    const phoneClean = formData.phone.replace(/\D/g, "");
    if (phoneClean.length !== 8) {
      toast.error(t.invalidPhone || "Le numéro de téléphone doit comporter 8 chiffres.");
      return;
    }

    // Validation du code postal (exactement 4 chiffres si renseigné)
    if (formData.zipCode.trim()) {
      const zipClean = formData.zipCode.replace(/\D/g, "");
      if (zipClean.length !== 4) {
        toast.error(t.invalidZipCode || "Le code postal doit comporter 4 chiffres.");
        return;
      }
    }

    setShowModal(true);
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      const orderItems = cartData.map((item) => {
        const p = products.find((pr) => pr._id === item._id);
        return { ...p, size: item.size, color: item.color, quantity: item.quantity };
      });
      const orderData = { address: formData, items: orderItems, amount: total, paymentMethod, promoCode: promoCode || null, discount: promoDiscount };

      if (paymentMethod === "cod") {
        const res = await fetch(`${backendUrl}/api/order/place-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json", token },
          body: JSON.stringify(orderData),
        });
        const data = await res.json();
        if (data.success) {
          setCartItems({});
          setShowModal(false);
          toast.success(t.orderSuccess);
          navigate("/profile");
        } else {
          toast.error(data.message || t.orderError);
        }
      } else {
        const res = await fetch(`${backendUrl}/api/order/stripe`, {
          method: "POST",
          headers: { "Content-Type": "application/json", token },
          body: JSON.stringify(orderData),
        });
        const data = await res.json();
        if (data.success && data.session_url) {
          window.location.replace(data.session_url);
        } else {
          toast.error(data.message || t.stripeError);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(t.serverError);
    } finally {
      setLoading(false);
    }
  };

  if (cartData.length === 0) {
    return (
      <div className="bg-gradient-to-b from-primaryLight to-gray-10/60 min-h-[calc(100vh-64px)]">
        <div className="max-padd-container py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/10 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-primary">{t.emptyCartTitle}</h2>
          <p className="text-gray-50 text-sm mt-2">{t.emptyCartDesc}</p>
          <Link to="/collection" className="inline-flex items-center gap-2 mt-7 bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg">
            {t.viewCollection} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = "px-4 py-3 rounded-xl border border-gray-10 bg-primaryLight text-primary text-sm font-medium focus:outline-none focus:border-primary focus:bg-white transition-all placeholder:text-gray-30";
  const labelClass = "text-xs font-bold text-gray-50 uppercase tracking-wide";

  return (
    <>
      <ConfirmOrderModal
        isOpen={showModal}
        onClose={() => !loading && setShowModal(false)}
        onConfirm={handleConfirmOrder}
        cartData={cartData}
        products={products}
        subtotal={subtotal}
        delivery_fee={delivery_fee}
        currency={currency}
        formData={formData}
        paymentMethod={paymentMethod}
        loading={loading}
        discount={promoDiscount}
        promoCode={promoCode}
        t={t}
      />

      <div className="bg-gradient-to-b from-primaryLight via-primaryLight to-gray-10/60 min-h-[calc(100vh-64px)]">
        <div className="max-padd-container py-14">

          <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline underline-offset-4 transition-all mb-8">
            <ArrowLeft className="w-4 h-4" /> {t.backToCart}
          </Link>

          <h1 className="text-3xl font-black text-primary mb-8">{t.placeOrderTitle}</h1>

          <form onSubmit={handleProceed} className="flex flex-col lg:flex-row gap-8 items-start">

            <div className="flex-1 w-full flex flex-col gap-6">

              {/* Personal info */}
              <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-10 shadow-sm p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-base font-black text-primary uppercase tracking-wide">{t.personalInfo}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="firstName" className={labelClass}>{t.firstName} <span className="text-tertiary">*</span></label>
                    <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} placeholder={t.firstNamePlaceholder} className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="lastName" className={labelClass}>{t.lastName} <span className="text-tertiary">*</span></label>
                    <input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} placeholder={t.lastNamePlaceholder} className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="email" className={labelClass}>{t.email}</label>
                    <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder={t.emailPlaceholder} className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="phone" className={labelClass}>{t.phone} <span className="text-tertiary">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-30" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={8}
                        pattern="[0-9]{8}"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={lang === 'fr' ? 'Ex: 98123456 (8 chiffres)' : 'e.g. 98123456 (8 digits)'}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-10 bg-primaryLight text-primary text-sm font-medium focus:outline-none focus:border-primary focus:bg-white transition-all placeholder:text-gray-30"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-10 shadow-sm p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-base font-black text-primary uppercase tracking-wide">{t.shippingAddress}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="street" className={labelClass}>{t.street} <span className="text-tertiary">*</span></label>
                    <input id="street" name="street" type="text" required value={formData.street} onChange={handleChange} placeholder={t.streetPlaceholder} className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="city" className={labelClass}>{t.city} <span className="text-tertiary">*</span></label>
                    <input id="city" name="city" type="text" required value={formData.city} onChange={handleChange} placeholder={t.cityPlaceholder} className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="state" className={labelClass}>{t.governorate}</label>
                    <select id="state" name="state" value={formData.state} onChange={handleChange} className={`${inputClass} cursor-pointer`}>
                      <option value="">{t.governoratePlaceholder}</option>
                      {TUNISIA_GOVERNORATES.map((gov) => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="zipCode" className={labelClass}>{t.postalCode}</label>
                    <input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      pattern="[0-9]{4}"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder={lang === 'fr' ? 'Ex: 1000' : 'e.g. 1000'}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="country" className={labelClass}>{t.country}</label>
                    <input id="country" name="country" type="text" value={formData.country} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white/80 backdrop-blur rounded-3xl border border-gray-10 shadow-sm p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-base font-black text-primary uppercase tracking-wide">{t.payment}</h2>
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="pay-cod" className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-gray-10 hover:border-gray-20"}`}>
                    <input id="pay-cod" type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="sr-only" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "cod" ? "border-primary" : "border-gray-20"}`}>
                      {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <Banknote className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-bold text-primary text-sm">{t.cashOnDelivery}</p>
                        <p className="text-xs text-gray-50 mt-0.5">{t.cashOnDeliveryDesc}</p>
                      </div>
                    </div>
                    {paymentMethod === "cod" && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                  </label>

                  <label htmlFor="pay-stripe" className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === "stripe" ? "border-primary bg-primary/5" : "border-gray-10 hover:border-gray-20"}`}>
                    <input id="pay-stripe" type="radio" name="paymentMethod" value="stripe" checked={paymentMethod === "stripe"} onChange={() => setPaymentMethod("stripe")} className="sr-only" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "stripe" ? "border-primary" : "border-gray-20"}`}>
                      {paymentMethod === "stripe" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-bold text-primary text-sm">{t.stripe}</p>
                        <p className="text-xs text-gray-50 mt-0.5">{t.stripeDesc}</p>
                      </div>
                    </div>
                    {paymentMethod === "stripe" && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                  </label>
                </div>
              </div>
            </div>

            {/* Sticky summary */}
            <div className="w-full lg:w-[360px] lg:sticky lg:top-24 flex flex-col gap-4">
              <div className="bg-primary text-white p-6 rounded-3xl shadow-xl">
                <h3 className="text-lg font-black mb-5 uppercase tracking-wider">{t.summary}</h3>
                <div className="flex flex-col gap-3 mb-5">
                  {cartData.map((item) => {
                    const p = products.find((pr) => pr._id === item._id);
                    if (!p) return null;
                    const img = Array.isArray(p.image) ? p.image[0] : p.image;
                    return (
                      <div key={`${item._id}-${item.size}-${item.color || "std"}`} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                          <img src={img} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-white/50 mt-0.5">{t.sizeLabel} {item.size}{item.color ? ` · ${item.color}` : ""} · x{item.quantity}</p>
                        </div>
                        <p className="text-xs font-black text-white flex-shrink-0">{p.price * item.quantity} {currency}</p>
                      </div>
                    );
                  })}
                </div>
                <hr className="border-white/10 mb-4" />

                {/* Promo code */}
                {promoCode ? (
                  <div className="mb-4 flex items-center justify-between bg-green-500/20 border border-green-500/30 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-300" />
                      <span className="text-xs font-bold text-green-200">{promoCode}</span>
                      <span className="text-xs text-green-300">- {promoDiscount} {currency}</span>
                    </div>
                    <button type="button" onClick={handleRemovePromo} className="text-green-400 hover:text-white transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wide mb-2 block">{t.promoCode}</label>
                    <div className="flex gap-2">
                      <input
                        id="promo-input"
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyPromo())}
                        placeholder={t.promoPlaceholder}
                        maxLength={20}
                        className="flex-1 px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold placeholder:text-white/30 placeholder:font-normal focus:outline-none focus:border-white/50 transition-all uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={promoLoading || !promoInput.trim()}
                        className="px-3 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {promoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Tag className="w-3.5 h-3.5" />}
                        {t.applyPromo}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between font-medium text-white/60">
                    <p>{t.subtotal}</p><p className="text-white">{subtotal} {currency}</p>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between font-medium text-green-400">
                      <p className="flex items-center gap-1"><Tag className="w-3 h-3" /> {t.promoDiscount}</p>
                      <p>- {promoDiscount} {currency}</p>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-white/60">
                    <p>{t.shippingFee}</p><p className="text-white">{delivery_fee === 0 ? t.freeShipping : `${delivery_fee} ${currency}`}</p>
                  </div>
                  <hr className="border-white/10 my-1" />
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold">{t.total}</p>
                    <p className="font-black text-2xl text-white">{total} {currency}</p>
                  </div>
                </div>
                <button id="place-order-btn" type="submit" className="mt-6 w-full bg-white text-primary text-sm font-bold uppercase tracking-wider py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg">
                  {t.placeOrderBtn} <ArrowRight className="w-4 h-4" />
                </button>
                <div className="mt-5 pt-5 border-t border-white/10 flex flex-col gap-2.5 text-xs text-white/50">
                  <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-white/70 shrink-0" /> {t.deliveryTunisia}</span>
                  <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-white/70 shrink-0" /> {t.securePayment}</span>
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-white/70 shrink-0" /> {t.processingTime}</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}