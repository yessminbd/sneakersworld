import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLang } from '../context/LangContext';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Package, ChevronDown,
  RefreshCw, Clock, CheckCircle2, Truck, XCircle,
  ShoppingBag, ArrowRight, LogOut, ShoppingCart, Layers
} from 'lucide-react';

/* ─── Status config ─────────────────────────────────────────────────── */
function resolveStatus(status = '', t) {
  const s = String(status || '').toLowerCase();
  if (s.includes('annul') || s.includes('cancel'))
    return { label: t.statusCancelled, pill: 'bg-red-100 text-red-700 border-red-200', step: -1, icon: XCircle, color: '#ef4444' };
  if (s.includes('livr') || s.includes('deliver'))
    return { label: t.statusDelivered, pill: 'bg-emerald-100 text-emerald-700 border-emerald-200', step: 3, icon: CheckCircle2, color: '#10b981' };
  if (s.includes('expédi') || s.includes('ship'))
    return { label: t.statusShipped, pill: 'bg-violet-100 text-violet-700 border-violet-200', step: 2, icon: Truck, color: '#8b5cf6' };
  if (s.includes('emballage') || s.includes('pack') || s.includes('prep'))
    return { label: t.statusPacking, pill: 'bg-blue-100 text-blue-700 border-blue-200', step: 1, icon: Package, color: '#3b82f6' };
  return { label: t.statusPending, pill: 'bg-amber-100 text-amber-700 border-amber-200', step: 0, icon: Clock, color: '#f59e0b' };
}

/* ─── Progress Bar ──────────────────────────────────────────────────── */
function ProgressBar({ step, t }) {
  const stepLabels = [t.statusPending, t.statusPacking, t.statusShipped, t.statusDelivered];
  if (step === -1) return (
    <div className="flex items-center gap-1.5 mt-3 text-xs text-red-500 font-semibold">
      <XCircle className="w-3.5 h-3.5" /> {t.statusCancelled}
    </div>
  );
  return (
    <div className="mt-3 flex items-center gap-0">
      {stepLabels.map((label, i) => {
        const done = i <= step;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${done ? 'bg-primary border-primary' : 'bg-white border-gray-200'
                }`}>
                {i < step && <span className="text-white text-[8px] font-black">✓</span>}
                {i === step && <span className="w-2 h-2 rounded-full bg-white block" />}
              </div>
              <span className={`text-[9px] font-semibold whitespace-nowrap leading-none ${done ? 'text-primary' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < stepLabels.length - 1 && (
              <div className={`flex-1 h-0.5 mb-3.5 transition-all duration-700 ${i < step ? 'bg-primary/60' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Order Card ────────────────────────────────────────────────────── */
function OrderCard({ order, t, lang, isOpen, onToggle }) {
  const st = resolveStatus(order.status, t);
  const StatusIcon = st.icon;
  const dateLocale = lang === 'fr' ? 'fr-FR' : 'en-US';
  const date = order.date
    ? new Date(order.date).toLocaleDateString(dateLocale, { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300">
      {/* Top row */}
      <button
        type="button"
        className="w-full flex items-start justify-between px-4 pt-4 pb-2 text-left select-none cursor-pointer outline-none focus:outline-none focus:ring-0 active:bg-gray-50/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border"
            style={{ backgroundColor: `${st.color}15`, borderColor: `${st.color}25` }}
          >
            <StatusIcon className="w-4 h-4" style={{ color: st.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-gray-400 font-mono font-medium">
              #{order._id?.slice(-8).toUpperCase() || 'ORDER'}
            </p>
            <p className="text-sm font-bold text-primary mt-0.5">
              {order.items?.length || 0} {t.items?.toLowerCase() || 'items'} · <span className="text-tertiary font-extrabold">{order.amount} DT</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3 mt-0.5">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${st.pill}`}>
            {st.label}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
        </div>
      </button>

      {/* Progress */}
      <div className="px-4 pb-3">
        <ProgressBar step={st.step} t={t} />
      </div>

      {/* Expanded */}
      {isOpen && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-3 bg-gray-50/30 animate-[fadeDown_0.2s_ease-out]">
          {/* Meta */}
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>📅 {date}</span>
            <span>{order.paymentMethod === 'cod' ? t.cashOnDelivery : order.paymentMethod} · {order.payment ? `✅ ${t.paidBadge}` : `⏳ ${t.pendingBadge}`}</span>
          </div>

          {/* Items */}
          <div className="space-y-2">
            {order.items?.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-2.5 flex items-center gap-3 shadow-2xs">
                {(item.image?.[0] || item.image) && (
                  <img
                    src={Array.isArray(item.image) ? item.image[0] : item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-primary truncate">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t.sizeLabel} {item.size}{item.color && ` · ${item.color}`} · {t.quantity} {item.quantity} · <span className="font-semibold text-tertiary">{item.price} DT</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Address */}
          {order.address && (
            <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-2xs">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">📍 {t.shippingAddress}</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                {[order.address.firstName, order.address.lastName, order.address.street, order.address.city, order.address.country].filter(Boolean).join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Skeleton ──────────────────────────────────────────────────────── */
function Skeleton({ className }) {
  return <div className={`animate-pulse  rounded-xl ${className}`} />;
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function Profile() {
  const { token, backendUrl, logout } = useContext(ShopContext);
  const { t, lang } = useLang();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingUser, setLU] = useState(true);
  const [loadingOrders, setLO] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLast] = useState(new Date());
  const [openOrderIds, setOpenOrderIds] = useState({});

  useEffect(() => { if (!token) navigate('/login'); }, [token, navigate]);

  const toggleOrder = (id) => {
    setOpenOrderIds(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${backendUrl}/api/user/profile`, { method: 'POST', headers: { token, 'Content-Type': 'application/json' } });
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (e) { console.warn(e); }
    finally { setLU(false); }
  }, [token, backendUrl]);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!token) return;
    silent ? setRefreshing(true) : setLO(true);
    try {
      const res = await fetch(`${backendUrl}/api/order/user-orders`, {
        method: 'POST',
        headers: { token, 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        const sorted = [...data.orders].sort((a, b) => b.date - a.date);
        setOrders(sorted);
        setLast(new Date());

        if (sorted.length > 0) {
          const firstKey = String(sorted[0]._id || `order-0-${sorted[0].date || ''}`);
          setOpenOrderIds(prev => ({ [firstKey]: true, ...prev }));
        }
      }
    } catch (e) { console.warn("Error fetching profile orders:", e); }
    finally { setLO(false); setRefreshing(false); }
  }, [token, backendUrl]);

  useEffect(() => { fetchProfile(); fetchOrders(); }, [fetchProfile, fetchOrders]);
  useEffect(() => {
    const timer = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(timer);
  }, [fetchOrders]);

  const initials = user?.name
    ? user.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const secAgo = Math.floor((new Date() - lastRefresh) / 1000);
  const refreshLabel = secAgo < 60 ? `${secAgo}s` : `${Math.floor(secAgo / 60)}min`;

  const totalOrders = orders.length;
  const inProgress = orders.filter(o => {
    const s = (o.status || '').toLowerCase();
    return !s.includes('livr') && !s.includes('deliver') && !s.includes('annul') && !s.includes('cancel');
  }).length;
  const delivered = orders.filter(o => {
    const s = (o.status || '').toLowerCase();
    return s.includes('livr') || s.includes('deliver');
  }).length;

  if (!token) return null;

  return (
    <div className="min-h-screen bg-primaryLight">

      {/* ── Hero Banner (compact dark header) ── */}
      <div className="relative overflow-hidden bg-primary">
        {/* Blur orbs */}
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-tertiary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-tertiary/8 blur-3xl pointer-events-none" />

        {/* SVG subtle grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="profile-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="14" fill="none" stroke="white" strokeWidth="1" />
              <line x1="0" y1="30" x2="60" y2="30" stroke="white" strokeWidth="0.5" />
              <line x1="30" y1="0" x2="30" y2="60" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#profile-grid)" />
        </svg>

        {/* Fade into light background */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-primaryLight to-transparent" />

        <div className="relative max-w-2xl mx-auto px-4 pt-4 pb-12">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="text-white/50 text-xs font-bold uppercase tracking-[0.2em]">{t.profileTitle}</span>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-white bg-white/8 hover:bg-white/15 border border-white/15 px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-3 h-3" /> {t.logout}
            </button>
          </div>

          {/* Avatar + info */}
          <div className="flex flex-col items-center text-center gap-1.5">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-tertiary/25 blur-md scale-110" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-tertiary to-tertiary/70 flex items-center justify-center shadow-xl border border-white/10">
                <span className="text-lg font-black text-white tracking-wide">{initials}</span>
              </div>
            </div>

            {loadingUser ? (
              <div className="flex flex-col items-center gap-1.5 w-full">
                <Skeleton className="h-5 w-40 mx-auto" />
                <Skeleton className="h-3.5 w-52 mx-auto" />
              </div>
            ) : (
              <>
                <h1 className="text-lg font-black text-white tracking-tight leading-tight">{user?.name || 'User'}</h1>
                <div className="flex items-center gap-1.5 text-white/40">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="text-xs font-medium">{user?.email || '—'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats + Orders ── */}
      <div className="max-w-2xl mx-auto px-4 -mt-8 relative z-10">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { n: totalOrders, label: t.totalOrdersLabel, icon: Layers, accent: '#8b5cf6' },
            { n: inProgress, label: t.inProgressLabel, icon: Package, accent: '#f59e0b' },
            { n: delivered, label: t.deliveredLabel, icon: CheckCircle2, accent: '#10b981' },
          ].map(({ n, label, icon: Icon, accent }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-gray-100 py-4 px-3 text-center shadow-lg hover:-translate-y-0.5 transition-transform duration-300"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2 border"
                style={{ backgroundColor: `${accent}12`, borderColor: `${accent}25` }}
              >
                <Icon className="w-4 h-4" style={{ color: accent }} />
              </div>
              <p className="text-2xl font-black text-primary leading-none">{n}</p>
              <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Orders section */}
        <div className="mt-6 pb-10">
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black text-primary">{t.ordersTitle}</h2>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600">LIVE</span>
              </span>
            </div>
            <button
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-50 hover:text-primary transition-colors bg-white border border-gray-10 px-3 py-1.5 rounded-full hover:border-gray-20 hover:shadow-sm cursor-pointer disabled:opacity-50"
              title={t.refreshTitle}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshLabel}</span>
            </button>
          </div>

          {/* Loading */}
          {loadingOrders ? (
            <div className="space-y-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-2.5 w-20" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>

            /* Empty state */
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 py-14 px-8 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-300" />
              </div>
              <p className="font-black text-primary text-base">{t.noOrdersTitle}</p>
              <p className="text-sm text-gray-400 mt-1">{t.noOrdersDesc}</p>
              <button
                onClick={() => navigate('/collection')}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-tertiary transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                {t.discoverCollection} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            /* Orders list */
          ) : (
            <div className="space-y-3">
              {orders.map((order, idx) => {
                const uniqueKey = String(order._id || `order-${idx}-${order.date || ''}`);
                return (
                  <OrderCard
                    key={uniqueKey}
                    order={order}
                    t={t}
                    lang={lang}
                    isOpen={!!openOrderIds[uniqueKey]}
                    onToggle={() => toggleOrder(uniqueKey)}
                  />
                );
              })}
            </div>
          )}

          {!loadingOrders && orders.length > 0 && (
            <p className="text-center text-xs text-gray-30 mt-5 font-medium">{t.autoRefreshNote}</p>
          )}
        </div>
      </div>
    </div>
  );
}