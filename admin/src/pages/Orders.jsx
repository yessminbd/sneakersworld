import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Package, MapPin, CreditCard, Calendar, ChevronDown, Search } from 'lucide-react'

const BACKEND_URL = 'http://localhost:4000'

const statusConfig = {
  'Order Placed':      { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200',  dot: 'bg-amber-400' },
  'Packing':           { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200',   dot: 'bg-blue-400' },
  'Shipped':           { bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-200', dot: 'bg-purple-400' },
  'Out for delivery':  { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-200', dot: 'bg-orange-400' },
  'Delivered':         { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-400' },
}


const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  const fetchOrders = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/order/list`, {}, { headers: { token } })
      if (res.data.success) setOrders(res.data.orders.reverse())
    } catch {
      toast.error('Failed to load orders.')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    try {
      await axios.post(`${BACKEND_URL}/api/order/status`, { orderId, status }, { headers: { token } })
      setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o))
      toast.success('Status updated.')
    } catch {
      toast.error('Error updating status.')
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const filtered = orders.filter(o => {
    const matchSearch = search === '' ||
      `${o.address?.firstName} ${o.address?.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      o._id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || o.status === filterStatus
    return matchSearch && matchStatus
  })

  // Stats
  const totalRevenue = orders.reduce((s, o) => s + o.amount, 0)
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="spinner" />
    </div>
  )

  return (
    <div className="p-6 page-enter">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-primary tracking-tight">Orders</h2>
          <p className="text-gray-30 text-sm mt-1 font-medium">
            {orders.length} order{orders.length !== 1 ? 's' : ''} · {deliveredCount} delivered · {totalRevenue.toLocaleString()} TND revenue
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or order ID..."
            className="input-field !pl-10 !py-2.5"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-gray-5 border border-gray-10 rounded-xl p-1 overflow-x-auto">
          {['All', ...Object.keys(statusConfig)].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filterStatus === s
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-40 hover:text-primary'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-5 flex items-center justify-center mx-auto mb-3">
            <Package size={22} className="text-gray-30" />
          </div>
          <p className="text-gray-40 font-semibold">No orders found</p>
          <p className="text-gray-30 text-sm mt-1">Try changing your search or filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const sc = statusConfig[order.status] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' }
            return (
              <div key={order._id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    {/* Status + Date Row */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className={`badge ${sc.bg} ${sc.text} border ${sc.border} gap-1.5`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {order.status}
                      </span>
                      <div className="flex items-center gap-1 text-gray-30">
                        <Calendar size={11} />
                        <span className="text-[0.65rem] font-medium">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <span className="text-[0.6rem] text-gray-20 font-mono">#{order._id.slice(-8).toUpperCase()}</span>
                    </div>

                    {/* Customer */}
                    <p className="font-bold text-primary text-base">
                      {order.address?.firstName} {order.address?.lastName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-gray-30">
                      <MapPin size={12} />
                      <span className="text-xs font-medium">
                        {order.address?.street && `${order.address.street}, `}{order.address?.city}, {order.address?.country}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {order.items?.map((item, i) => (
                        <span key={i} className="badge bg-gray-5 text-gray-50 border border-gray-10">
                          {item.name} <span className="text-gray-30">×{item.quantity}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="text-right flex flex-col items-end gap-2.5">
                    <p className="font-extrabold text-primary text-xl tracking-tight">{order.amount} TND</p>
                    <div className="flex items-center gap-1.5 text-gray-30">
                      <CreditCard size={12} />
                      <span className="text-xs font-medium capitalize">{order.paymentMethod}</span>
                      {order.payment && <span className="badge bg-emerald-50 text-emerald-600 border border-emerald-200 !text-[0.6rem]">Paid</span>}
                    </div>
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        className="select-field !py-2 !pl-3 !pr-8 !text-xs !rounded-lg !min-w-[160px] font-semibold"
                      >
                        {Object.keys(statusConfig).map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Orders
