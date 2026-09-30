import React from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import logo from '../assets/logo-sneakers-world.png'

const pageTitles = {
  '/': 'Dashboard',
  '/add': 'Add Product',
  '/list': 'Products',
  '/orders': 'Orders',
}

const Navbar = () => {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Dashboard'

  return (
    <header className="h-[76px] bg-[#efefef] border-b border-black/5 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left: logo + Admin below, then page title */}
      <div className="flex items-center gap-5">
        <div className="flex flex-col items-center leading-none">
          <img src={logo} alt="SneakersWorld" className="h-9 w-auto object-contain" />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="relative hidden md:flex items-center">
          <Search size={14} className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 bg-white border border-black/10 rounded-full text-xs w-48 focus:w-56 outline-none focus:ring-2 focus:ring-black/10 transition-all duration-300 font-medium text-[#1f1f23] placeholder:text-gray-400"
          />
        </div>

        <button className="w-9 h-9 rounded-full bg-white border border-black/10 flex items-center justify-center hover:bg-gray-100 transition-colors relative">
          <Bell size={15} className="text-gray-600" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#e63946] rounded-full border-2 border-[#efefef]" />
        </button>


      </div>
    </header>
  )
}

export default Navbar