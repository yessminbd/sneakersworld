import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";
import slide4 from "../assets/slide4.jpg";

export const ShopContext = createContext();

// Catalogue initial avec les sneakers de la collection en attendant les données backend
const defaultProducts = [
  {
    _id: "sw_01",
    name: "Adidas Campus 00s Pink",
    category: "Adidas",
    price: 380,
    description: "Iconic suede silhouette with bold pink contrast and retro chunky laces.",
    image: [slide1],
    popular: true,
    sizes: ["36", "37", "38", "39", "40", "41"],
  },
  {
    _id: "sw_02",
    name: "New Balance 530 White Silver",
    category: "New Balance",
    price: 420,
    description: "Classic running shoe aesthetic with ABZORB cushioning for all-day comfort.",
    image: [slide2],
    popular: true,
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
  },
  {
    _id: "sw_03",
    name: "On Cloudmonster All Black",
    category: "On Running",
    price: 540,
    description: "Maximum CloudTec cushioning for monster bounce and premium street look.",
    image: [slide3],
    popular: true,
    sizes: ["40", "41", "42", "43", "44", "45"],
  },
  {
    _id: "sw_04",
    name: "Puma Speedcat OG Red",
    category: "Puma",
    price: 350,
    description: "Motorsport heritage with rich red suede and timeless racing profile.",
    image: [slide4],
    popular: true,
    sizes: ["39", "40", "41", "42", "43"],
  },
];

export default function ShopContextProvider({ children }) {
  const [products, setProducts] = useState(defaultProducts);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // Ajouter au panier
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error('Please select a size!', { autoClose: 2000 });
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
    toast.success('Added to cart successfully!', { autoClose: 2000 });
  };

  // Compter le nombre d'articles dans le panier
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  // Mettre à jour la quantité
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  // Calculer le montant total
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  // Récupération automatique des produits depuis l'API backend (/api/product/list)
  const getProductsData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/product/list`);
      const data = await response.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      }
    } catch (error) {
      console.warn("Backend /api/product/list non joignable, utilisation des données locales :", error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setCartItems({});
  };

  const value = {
    products,
    setProducts,
    backendUrl,
    getProductsData,
    currency: "DT",
    delivery_fee: 0,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    token,
    setToken,
    logout,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}
