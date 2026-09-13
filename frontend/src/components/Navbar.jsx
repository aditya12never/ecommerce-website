import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiLogIn,
  FiLogOut,
  FiUserPlus,
  FiShield,
} from "react-icons/fi";

import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { cartCount } = useCart();
  const { user, isLoggedIn, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive
        ? "text-gray-900"
        : "text-gray-500 hover:text-gray-900"
    }`;

  const isAdmin =
    isLoggedIn &&
    user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">

      {/* Main Navbar */}
      <div className="shop-container">

        <div className="flex h-[68px] items-center justify-between gap-4">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="shrink-0 text-2xl font-extrabold tracking-tight text-gray-900"
          >
            ShopZone
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 md:flex">

            <NavLink
              to="/"
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={navLinkClass}
            >
              Products
            </NavLink>

            <NavLink
              to="/orders"
              className={navLinkClass}
            >
              Orders
            </NavLink>

            {/* Admin Dashboard */}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={navLinkClass}
              >
                Admin Dashboard
              </NavLink>
            )}

          </nav>

          {/* Desktop Right Side */}
          <div className="hidden items-center gap-3 md:flex">

            {/* User */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">

                <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white">
                    <FiUser size={16} />
                  </div>

                  <div className="max-w-[140px]">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      Hi, {user?.name}
                    </p>

                    <p className="truncate text-xs text-gray-400">
                      {user?.email}
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-10 items-center gap-2 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>

              </div>
            ) : (
              <div className="flex items-center gap-2">

                <Link
                  to="/login"
                  className="flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  <FiLogIn size={16} />
                  Login
                </Link>

                <Link
                  to="/register"
                  className="flex h-10 items-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  <FiUserPlus size={16} />
                  Register
                </Link>

              </div>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100"
              aria-label="Shopping cart"
            >
              <FiShoppingCart size={21} />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-bold text-white">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

          </div>

          {/* Mobile Right Side */}
          <div className="flex items-center gap-2 md:hidden">

            {/* Mobile Cart */}
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-700"
              aria-label="Shopping cart"
            >
              <FiShoppingCart size={21} />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-bold text-white">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

            {/* Menu Button */}
            <button
              type="button"
              onClick={() =>
                setIsMenuOpen(!isMenuOpen)
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100"
              aria-label={
                isMenuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <FiX size={23} />
              ) : (
                <FiMenu size={23} />
              )}
            </button>

          </div>

        </div>

      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">

          <div className="shop-container py-5">

            {/* Mobile User */}
            {isLoggedIn && (
              <div className="mb-5 flex items-center gap-3 rounded-2xl bg-gray-50 p-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
                  <FiUser size={20} />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {user?.name}
                  </p>

                  <p className="truncate text-sm text-gray-500">
                    {user?.email}
                  </p>
                </div>

              </div>
            )}

            {/* Navigation */}
            <nav className="flex flex-col">

              <NavLink
                to="/"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `border-b border-gray-100 py-4 text-sm font-semibold ${
                    isActive
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/products"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `border-b border-gray-100 py-4 text-sm font-semibold ${
                    isActive
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`
                }
              >
                Products
              </NavLink>

              <NavLink
                to="/orders"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `border-b border-gray-100 py-4 text-sm font-semibold ${
                    isActive
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`
                }
              >
                Orders
              </NavLink>

              {/* Mobile Admin Dashboard */}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-2 border-b border-gray-100 py-4 text-sm font-semibold ${
                      isActive
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`
                  }
                >
                  <FiShield size={17} />
                  Admin Dashboard
                </NavLink>
              )}

            </nav>

            {/* Mobile Authentication */}
            <div className="mt-5">

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                >
                  <FiLogOut size={17} />
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <FiLogIn size={17} />
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gray-900 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    <FiUserPlus size={17} />
                    Register
                  </Link>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </header>
  );
}

export default Navbar;