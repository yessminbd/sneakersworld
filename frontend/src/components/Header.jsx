import { useState, useContext } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LayoutGrid,
  Globe,
  LogOut,
  LogIn,
  ChevronRight,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useLang } from "../context/LangContext";
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

  const { lang, toggleLang, t } = useLang();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate("/collection");
      setSearchOpen(false);
      closeMenu();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-primaryLight/95 backdrop-blur-md shadow-sm border-b border-gray-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-16 sm:h-18">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center shrink-0 transition-transform duration-200 hover:scale-[1.02] active:scale-95"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="Sneakers World"
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </Link>


        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">

          {/* Desktop Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-30 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim()) navigate("/collection");
              }}
              placeholder={t.searchPlaceholder}
              className="pl-9 pr-3 py-2 w-44 xl:w-52 rounded-full bg-gray-10 text-sm text-primary placeholder:text-gray-30 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2 rounded-full text-primary hover:bg-gray-10 transition-colors cursor-pointer"
            aria-label="Search"
          >
            {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          {/* Collection */}
          <Link
            to="/collection"
            onClick={closeMenu}
            className="p-2 rounded-full hover:bg-gray-10 transition-colors text-primary"
            aria-label={t.collection}
            title={t.collection}
          >
            <LayoutGrid className="w-5 h-5" />
          </Link>
          {/* Cart */}
          <Link
            to="/cart"
            onClick={closeMenu}
            className="relative p-2 rounded-full hover:bg-gray-10 transition-colors text-primary"
            aria-label={t.cart}
          >
            <ShoppingCart className="w-5 h-5" />
            {getCartCount() > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-tertiary text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-scaleIn shadow-sm">
                {getCartCount()}
              </span>
            )}
          </Link>
{/* User Profile Icon / Connection Button */}
          {token ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/profile"
                onClick={closeMenu}
                className="p-2 rounded-full hover:bg-gray-10 transition-colors text-primary"
                aria-label={t.myProfile}
                title={t.myProfile}
              >
                <User className="w-5 h-5" />
              </Link>

              <button
                onClick={logout}
                className="hidden sm:block text-xs font-bold px-3 py-1.5 rounded-full border border-gray-20 text-primary hover:bg-gray-10 transition-all cursor-pointer"
              >
                {t.logout}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary text-primaryLight hover:bg-tertiary transition-all duration-200 shadow-sm active:scale-95"
            >
              {t.login}
            </Link>
          )}

          {/* Language Switcher Button */}
          <button
            id="lang-toggle-btn"
            onClick={toggleLang}
            aria-label={lang === "en" ? "Passer en Français" : "Switch to English"}
            title={lang === "en" ? "Passer en Français" : "Switch to English"}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border border-gray-20 bg-primaryLight text-primary text-xs font-bold hover:bg-gray-10 hover:border-primary transition-all select-none cursor-pointer shadow-2xs active:scale-95"
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span className="tracking-wider uppercase font-black text-[11px] sm:text-xs">{lang === "en" ? "FR" : "EN"}</span>
          </button>

          
          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-full text-primary hover:bg-gray-10 transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Input Bar */}
      {searchOpen && (
        <form onSubmit={handleMobileSearchSubmit} className="lg:hidden px-4 pb-3 pt-1">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-30 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              autoFocus
              className="pl-10 pr-4 py-2.5 w-full rounded-2xl bg-white border border-gray-20 text-sm text-primary placeholder:text-gray-30 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
            />
          </div>
        </form>
      )}

      {/* ── Mobile Menu: Collection | Panier | Profil | Langue | Déconnexion ── */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-10 bg-white shadow-2xl animate-[slideDown_0.2s_ease-out]">
          <div className="px-4 py-4 flex flex-col gap-2">

            {/* 1. Collection */}
            <NavLink
              to="/collection"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-primary hover:bg-gray-10 bg-gray-10/40"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-5 h-5" />
                <span>{t.collection}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </NavLink>

            {/* 2. Panier */}
            <NavLink
              to="/cart"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-primary hover:bg-gray-10 bg-gray-10/40"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                <span>{t.cart}</span>
              </div>
              {getCartCount() > 0 ? (
                <span className="bg-tertiary text-white text-xs px-2.5 py-0.5 rounded-full font-black">
                  {getCartCount()}
                </span>
              ) : (
                <ChevronRight className="w-4 h-4 opacity-50" />
              )}
            </NavLink>

            {/* 3. Profil */}
            <NavLink
              to={token ? "/profile" : "/login"}
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-primary hover:bg-gray-10 bg-gray-10/40"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                <span>{token ? t.myProfile : t.login}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </NavLink>

            {/* 4. Langue */}
            <button
              onClick={toggleLang}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-primary hover:bg-gray-10 bg-gray-10/40 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-tertiary" />
                <span>{lang === "en" ? "Language" : "Langue"}</span>
              </div>
              <span className="px-3 py-1 rounded-xl bg-white border border-gray-20 text-xs font-black text-primary uppercase shadow-2xs">
                {lang === "en" ? "FR" : "EN"}
              </span>
            </button>

            {/* 5. Déconnexion (si connecté) ou Connexion */}
            {token ? (
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="w-full mt-2 flex items-center justify-center gap-2.5 py-3 rounded-2xl border-2 border-red-200 bg-red-50/50 text-red-600 text-sm font-bold hover:bg-red-100 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.logout}</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="w-full mt-2 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-primary text-white text-sm font-bold hover:bg-tertiary transition-all shadow-md active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>{t.login}</span>
              </Link>
            )}

          </div>
        </div>
      )}
    </header>
  );
}