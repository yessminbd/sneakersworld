import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  PackagePlus,
  List,
  ShoppingBag,
  LogOut,
  ChevronLeft,
} from 'lucide-react'

const Sidebar = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false)

  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/add', icon: <PackagePlus size={20} />, label: 'Add Product' },
    { to: '/list', icon: <List size={20} />, label: 'Products' },
    { to: '/orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
  ]

  const linkBase =
    'flex items-center gap-3 h-11 rounded-xl text-sm font-semibold transition-all duration-200'

  return (
    <aside
      className={`${
        collapsed ? 'w-[78px]' : 'w-[260px]'
      } min-h-screen bg-[#efefef] border-r border-black/5 flex flex-col transition-all duration-300 ease-in-out relative`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-6 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border border-black/10 hover:scale-110 transition-transform z-50"
      >
        <ChevronLeft
          size={12}
          className={`text-gray-500 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-3 flex flex-col gap-1 mt-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            title={collapsed ? link.label : undefined}
            className={({ isActive }) =>
              `${linkBase} ${collapsed ? 'justify-center px-0' : 'px-4'} ${
                isActive
                  ? 'bg-white text-[#e63946] shadow-sm'
                  : 'text-gray-600 hover:bg-white/60 hover:text-[#1f1f23]'
              }`
            }
          >
            <span className="flex-shrink-0">{link.icon}</span>
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-black/5">
        <button
          onClick={onLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`${linkBase} w-full bg-[#e63946] text-white hover:bg-[#d62839] shadow-sm ${
            collapsed ? 'justify-center px-0' : 'px-4'
          }`}
        >
          <LogOut size={18} />
          {!collapsed && <span>Se déconnecter</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar