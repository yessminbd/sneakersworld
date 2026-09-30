import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AddProduct from './pages/AddProduct'
import ListProducts from './pages/ListProducts'
import Orders from './pages/Orders'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '')

  const handleLogout = () => {
    setToken('')
    localStorage.removeItem('adminToken')
  }

  if (!token) {
    return (
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Login setToken={setToken} />
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex min-h-screen bg-primaryLight">
        <Sidebar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard token={token} />} />
              <Route path="/add" element={<AddProduct token={token} />} />
              <Route path="/list" element={<ListProducts token={token} />} />
              <Route path="/orders" element={<Orders token={token} />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
