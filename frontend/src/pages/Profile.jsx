import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLang } from '../context/LangContext';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Package, ChevronDown,
  RefreshCw, Clock, CheckCircle2, Truck, XCircle,
  ShoppingBag, ArrowRight, LogOut
} from 'lucide-react';

/* ─── Status config helper ───────────────────────────────────────────── */
function resolveStatus(status = '', t) {
  const s = String(status || '').toLowerCase();
  if (s.includes('annul') || s.includes('cancel')) {
    return { label: t.statusCancelled, pill: 'bg-red-100 text-red-700 border-red-300', step: -1, icon: XCircle };
  }
  if (s.includes('livr') || s.includes('deliver')) {
    return { label: t.statusDelivered, pill: 'bg-green-100 text-green-700 border-green-300', step: 3, icon: CheckCircle2 };
  }
  if (s.includes('expédi') || s.includes('ship')) {
    return { label: t.statusShipped, pill: 'bg-violet-100 text-violet-700 border-violet-300', step: 2, icon: Truck };
  }
  if (s.includes('emballage') || s.includes('pack') || s.includes('prep')) {
    return { label: t.statusPacking, pill: 'bg-blue-100 text-blue-700 border-blue-300', step: 1, icon: Package };
  }
  return { label: t.statusPending, pill: 'bg-amber-100 text-amber-700 border-amber-300', step: 0, icon: Clock };
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
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                done ? 'bg-primary border-primary' : 'bg-white border-gray-300'
              }`}>
                {i < step && <span className="text-white text-[8px] font-black">✓</span>}
                {i === step && <span className="w-2 h-2 rounded-full bg-white block" />}
              </div>
              <span className={`text-[9px] font-semibold whitespace-nowrap leading-none ${done ? 'text-primary' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < stepLabels.length - 1 && (
              <div className={`flex-1 h-0.5 mb-3.5 transition-all duration-700 ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Order Card ────────────────────────────────────────────────────── */
function OrderCard({ order, t, lang }) {
  const [open, setOpen] = useState(false);
  const st = resolveStatus(order.status, t);
  const StatusIcon = st.icon;
  const dateLocale = lang === 'fr' ? 'fr-FR' : 'en-US';
  const date = order.date
    ? new Date(order.date).toLocaleDateString(dateLocale, { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">

      {/* Top row */}
      <button
        className="w-full flex items-start justify-between px-4 pt-4 pb-2 hover:bg-gray-50/60 transition-colors cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3 min-w-0 text-left">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
            <StatusIcon className="w-4 h-4 text-gray-500" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-gray-400 font-mono font-medium">
              #{order._id?.slice(-8).toUpperCase()}
            </p>
            <p className="text-sm font-bold text-primary mt-0.5">
              {order.items?.length || 0} {t.items?.toLowerCase() || 'items'} · <span className="text-tertiary">{order.amount} DT</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3 mt-0.5">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${st.pill}`}>
            {st.label}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Progress */}
      <div className="px-4 pb-3">
        <ProgressBar step={st.step} t={t} />
      </div>

      {/* Expanded */}
      {open && (
        <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-3 space-y-3">

          {/* Meta */}
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>📅 {date}</span>
            <span>{order.paymentMethod === 'cod' ? t.cashOnDelivery : order.paymentMethod} · {order.payment ? `✅ ${t.paidBadge}` : `⏳ ${t.pendingBadge}`}</span>
          </div>

          {/* Items */}
          <div className="space-y-2">
            {order.items?.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-2.5 flex items-center gap-3">
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
                    {t.sizeLabel} {item.size}{item.color && ` · ${item.color}`} · {t.quantity} {item.quantity} · <span className="font-semibold">{item.price} DT</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Address */}
          {order.address && (
            <div className="bg-white rounded-xl border border-gray-100 p-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">📍 {t.shippingAddress}</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                {[
                  order.address.firstName, order.address.lastName,
                  order.address.street, order.address.city, order.address.country
                ].filter(Boolean).join(', ')}
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
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />;
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function Profile() {
  const { token, backendUrl, logout } = useContext(ShopContext);
  const { t, lang } = useLang();
  const navigate = useNavigate();

  const [user, setUser]           = useState(null);
  const [orders, setOrders]       = useState([]);
  const [loadingUser, setLU]      = useState(true);
  const [loadingOrders, setLO]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLast]    = useState(new Date());

  useEffect(() => { if (!token) navigate('/login'); }, [token, navigate]);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res  = await fetch(`${backendUrl}/api/user/profile`, {
        method: 'POST', headers: { token, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (e) { console.warn(e); }
    finally { setLU(false); }
  }, [token, backendUrl]);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!token) return;
    silent ? setRefreshing(true) : setLO(true);
    try {
      const res  = await fetch(`${backendUrl}/api/order/userorders`, {
        method: 'POST', headers: { token, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setOrders([...(data.orders || [])].sort((a, b) => b.date - a.date));
        setLast(new Date());
      }
    } catch (e) { console.warn(e); }
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

  const totalOrders   = orders.length;
  const inProgress    = orders.filter(o => {
    const s = (o.status || '').toLowerCase();
    return !s.includes('livr') && !s.includes('deliver') && !s.includes('annul') && !s.includes('cancel');
  }).length;
  const delivered     = orders.filter(o => {
    const s = (o.status || '').toLowerCase();
    return s.includes('livr') || s.includes('deliver');
  }).length;

  if (!token) return null;

  return (
    <div className="min-h-screen bg-primaryLight">

      {/* ── Hero Banner ── */}
      <div className="relative h-44 bg-primary overflow-hidden">
        {/* Sneaker pattern SVG overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="20" fill="none" stroke="white" strokeWidth="1.5"/>
              <line x1="0" y1="40" x2="80" y2="40" stroke="white" strokeWidth="0.5"/>
              <line x1="40" y1="0" x2="40" y2="80" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/80" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="text-white/60 text-xs font-medium uppercase tracking-widest">{t.profileTitle}</div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full transition-all cursor-pointer"
          >
            <LogOut className="w-3 h-3" /> {t.logout}
          </button>
        </div>
      </div>

      {/* ── Profile Card (overlapping hero) ── */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 -mt-8 relative z-10 overflow-hidden">

          {/* Avatar centered */}
          <div className="flex flex-col items-center pt-6 pb-5 px-6">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-xl mb-3">
              <span className="text-2xl font-black text-white tracking-wide">{initials}</span>
            </div>

            {loadingUser ? (
              <div className="flex flex-col items-center gap-2 w-full">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            ) : (
              <>
                <h1 className="text-xl font-black text-primary tracking-tight text-center">
                  {user?.name || 'User'}
                </h1>
                <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-sm font-medium">{user?.email || '—'}</span>
                </div>
              </>
            )}

            {/* ── Stats ── */}
            <div className="mt-5 grid grid-cols-3 gap-2 w-full">
              {[
                { n: totalOrders, label: t.totalOrdersLabel },
                { n: inProgress,  label: t.inProgressLabel },
                { n: delivered,   label: t.deliveredLabel },
              ].map(({ n, label }) => (
                <div key={label} className="bg-gray-50 border border-gray-100 rounded-2xl py-3 text-center">
                  <p className="text-2xl font-black text-primary leading-none">{n}</p>
                  <p className="text-[11px] text-gray-400 font-semibold mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Orders Section ── */}
        <div className="mt-6 pb-10">

          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black text-primary">{t.ordersTitle}</h2>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-green-600">LIVE</span>
              </span>
            </div>
            <button
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-primary transition-colors bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-gray-300 hover:shadow-sm cursor-pointer"
              title={t.refreshTitle}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshLabel}</span>
            </button>
          </div>

          {/* Content */}
          {loadingOrders ? (
            <div className="space-y-3">
              {[0,1,2].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-2.5 w-20" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 py-14 px-8 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-300" />
              </div>
              <p className="font-bold text-gray-500 text-base">{t.noOrdersTitle}</p>
              <p className="text-sm text-gray-400 mt-1">{t.noOrdersDesc}</p>
              <button
                onClick={() => navigate('/collection')}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-tertiary transition-all duration-200 cursor-pointer"
              >
                {t.discoverCollection} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => <OrderCard key={order._id} order={order} t={t} lang={lang} />)}
            </div>
          )}

          {!loadingOrders && orders.length > 0 && (
            <p className="text-center text-xs text-gray-400 mt-5 font-medium">
              {t.autoRefreshNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
