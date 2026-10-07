import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Package,
  ShoppingBag,
  Wallet,
  Clock,
  Hourglass,
  PackagePlus,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  BarChart3,
} from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
const WEEK = 7 * 24 * 60 * 60 * 1000

const STATUS_STYLES = {
  'Order Placed': { badge: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'bg-amber-400' },
  'Packing': { badge: 'bg-blue-50 text-blue-700 border-blue-200', bar: 'bg-blue-400' },
  'Shipped': { badge: 'bg-purple-50 text-purple-700 border-purple-200', bar: 'bg-purple-400' },
  'Out for delivery': { badge: 'bg-orange-50 text-orange-700 border-orange-200', bar: 'bg-orange-400' },
  'Delivered': { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-400' },
}
const FALLBACK = { badge: 'bg-gray-50 text-gray-600 border-gray-200', bar: 'bg-gray-400' }

// Real trend: last 7 days vs previous 7 days (null if orders have no date)
const weeklyTrend = (orders, getValue) => {
  if (!orders.length || orders.some((o) => !o.date)) return null
  const now = Date.now()
  const cur = orders.filter((o) => o.date > now - WEEK).reduce((s, o) => s + getValue(o), 0)
  const prev = orders
    .filter((o) => o.date <= now - WEEK && o.date > now - 2 * WEEK)
    .reduce((s, o) => s + getValue(o), 0)
  if (prev === 0) return cur > 0 ? 100 : 0
  return Math.round(((cur - prev) / prev) * 100)
}

const Dashboard = ({ token }) => {
  const [products, setProducts] = useState(0)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true)
    try {
      const [pRes, oRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/product/list`),
        axios.post(`${BACKEND_URL}/api/order/list`, {}, { headers: { token } }),
      ])
      setProducts(pRes.data.success ? pRes.data.products.length : 0)
      setOrders(oRes.data.success ? oRes.data.orders : [])
    } catch {
      toast.error('Unable to load the dashboard.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [token])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const revenue = orders.reduce((s, o) => s + (o.amount || 0), 0)
  const pending = orders.filter((o) => o.status === 'Order Placed').length

  // Most recent orders first (sorted by date, not by position)
  const recentOrders = [...orders]
    .sort((a, b) => (b.date || 0) - (a.date || 0))
    .slice(0, 6)

  const statusCounts = Object.keys(STATUS_STYLES).map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }))

  const statCards = [
    {
      label: 'Products',
      value: products,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      trend: null,
    },
    {
      label: 'Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: 'bg-purple-50 text-purple-600',
      trend: weeklyTrend(orders, () => 1),
    },
    {
      label: 'Revenue',
      value: `${revenue.toLocaleString('en-US')} TND`,
      icon: Wallet,
      color: 'bg-emerald-50 text-emerald-600',
      trend: weeklyTrend(orders, (o) => o.amount || 0),
    },
    {
      label: 'Pending',
      value: pending,
      icon: Hourglass,
      color: 'bg-amber-50 text-amber-600',
      trend: null,
    },
  ]

  const card = 'bg-white rounded-2xl border border-black/5 shadow-sm'

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 w-56 bg-black/5 rounded-lg mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-black/5 rounded-2xl" />
          ))}
        </div>
        <div className="h-72 bg-black/5 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <NavLink
            to="/stats"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#e63946] text-white shadow-sm shadow-[#e63946]/20 text-sm font-semibold hover:bg-[#d62839] transition"
          >
            <BarChart3 size={15} />
            Stats & Rapports PDF
          </NavLink>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-black/5 shadow-sm text-sm font-semibold text-gray-700 hover:shadow-md transition disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className={`${card} p-5 hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={20} />
              </div>
              {trend !== null && (
                <span
                  className={`flex items-center gap-0.5 text-xs font-semibold ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'
                    }`}
                >
                  {trend >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {Math.abs(trend)}%
                </span>
              )}
            </div>
            <p className="mt-4 text-[0.7rem] text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5 tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className={`lg:col-span-2 ${card} overflow-hidden`}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-gray-400" />
              <h3 className="font-bold text-gray-900 text-sm">Recent Orders</h3>
            </div>
            <NavLink to="/orders" className="text-xs font-semibold text-[#e63946] hover:underline">
              View all →
            </NavLink>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-10 text-center text-gray-500 text-sm">No orders yet.</div>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between px-5 py-3.5 border-b border-black/5 last:border-0  transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={15} className="text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {order.address?.firstName} {order.address?.lastName}
                    </p>
                    <p className="text-[0.7rem] text-gray-500">
                      {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                      {order.date && ` · ${new Date(order.date).toLocaleDateString('en-US')}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`hidden bg-white sm:inline-block px-2.5 py-1 rounded-full text-[0.7rem] font-semibold border ${(STATUS_STYLES[order.status] || FALLBACK).badge
                      }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-bold text-gray-900 w-20 text-right">{order.amount} TND</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Status breakdown */}
          <div className={`${card} p-5`}>
            <h3 className="font-bold text-gray-900 text-sm mb-4">Orders by Status</h3>
            <div className="flex flex-col gap-3">
              {statusCounts.map(({ status, count }) => {
                const pct = orders.length ? (count / orders.length) * 100 : 0
                return (
                  <div key={status}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 font-medium">{status}</span>
                      <span className="text-gray-900 font-bold">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${STATUS_STYLES[status].bar} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick action */}
          <div className={`${card} p-6 flex flex-col items-center text-center`}>
            <div className="w-14 h-14 rounded-2xl bg-[#e63946] flex items-center justify-center mb-3 shadow-lg shadow-[#e63946]/25">
              <PackagePlus size={24} className="text-white" />
            </div>
            <h3 className="font-bold text-gray-900">Add New Sneaker</h3>
            <p className="text-gray-500 text-xs mt-1.5 leading-relaxed max-w-[200px]">
              Grow your catalog by adding new products to the store.
            </p>
            <NavLink
              to="/add"
              className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#e63946] text-white text-sm font-bold hover:bg-[#d62839] transition"
            >
              <PackagePlus size={15} />
              Add Product
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard