import Header from "./components/Header";
import Footer from "./components/Footer";
import Features from "./components/Features";
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import Verify from "./pages/Verify";
import About from "./pages/About";
import Product from "./pages/Product";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {

  return (
    <main className="overflow-x-hidden text-[#1B264F] bg-primaryLight">
      <ToastContainer/>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/product/:productId" element={<Product />} />
      </Routes>
      <Footer />
    </main>
  )
}