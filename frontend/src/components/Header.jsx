import { useState, useContext } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LayoutGrid,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import logo from "../assets/logo-sneakers-world.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const {
    getCartCount,
    search,
    setSearch,
    token,
    logout,
  } = useContext(ShopContext);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-primaryLight border-b border-gray-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center shrink-0 transition-opacity hover:opacity-80"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="Sneakers World"
            className="h-8 sm:h-9 w-auto"
          />
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* Desktop Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-30 pointer-events-none" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-3 py-2 w-48 lg:w-64 rounded-full bg-gray-10 text-sm text-primary placeholder:text-gray-30 outline-none focus:ring-2 focus:ring-gray-20 transition-all"
            />
          </div>

          {/* Mobile Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="sm:hidden p-2 rounded-full text-primary hover:bg-gray-10"
            aria-label="Search"
          >
            {searchOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>

          {/* Collection */}
          <NavLink
            to="/collection"
            onClick={closeMenu}
            title="Collection"
            aria-label="Collection"
            className={({ isActive }) =>
              `p-2 rounded-full transition-colors ${
                isActive
                  ? "text-tertiary bg-gray-10"
                  : "text-primary hover:bg-gray-10"
              }`
            }
          >
            <LayoutGrid className="w-5 h-5" />
          </NavLink>

          {/* Cart */}
          <Link
            to="/cart"
            onClick={closeMenu}
            className="relative p-2 rounded-full hover:bg-gray-10 transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5 text-primary" />

            {getCartCount() > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-tertiary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* Desktop Account */}
          {token ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/orders"
                className="p-2 rounded-full hover:bg-gray-10 transition-colors"
                aria-label="My Orders"
              >
                <User className="w-5 h-5 text-primary" />
              </Link>

              <button
                onClick={logout}
                className="text-sm font-medium px-4 py-2 rounded-full border border-gray-20 text-primary hover:bg-gray-10 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:block text-sm font-medium px-4 py-2 rounded-full bg-primary text-primaryLight hover:bg-tertiary transition-all"
            >
              Log In
            </Link>
          )}

          {/* Mobile Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 rounded-full text-primary hover:bg-gray-10"
            aria-label="Menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {searchOpen && (
        <div className="sm:hidden px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-30 pointer-events-none" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sneakers..."
              autoFocus
              className="pl-9 pr-4 py-2.5 w-full rounded-full bg-gray-10 text-sm text-primary placeholder:text-gray-30 outline-none focus:ring-2 focus:ring-gray-20"
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="sm:hidden border-t border-gray-10 px-3 py-3 bg-primaryLight">

          {token ? (
            <>
              {/* Orders */}
              <Link
                to="/orders"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary hover:bg-gray-10 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">
                  My Orders
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="w-full mt-1 text-center text-sm font-medium py-2.5 rounded-full border border-gray-20 text-primary hover:bg-gray-10 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="block text-center text-sm font-medium py-2.5 rounded-full bg-primary text-primaryLight hover:bg-tertiary transition-all"
            >
              Log In
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}