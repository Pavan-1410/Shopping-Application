import { useState } from "react";

import {
  Search,
  ShoppingCart,
  LogOut,
  Package,
} from "lucide-react";

import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";

import useAuthStore from "../../store/authstore";

import { auth } from "../../config/firebase";

import useCartStore from "../../store/cartStore";

const Navbar = () => {
  const navigate = useNavigate();

  const { logout } = useAuthStore();

  const [search, setSearch] = useState("");

  const { items } = useCartStore();

  const totalProducts = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);

      logout();

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      navigate("/home");
      return;
    }

    navigate(
      `/home?search=${encodeURIComponent(trimmedSearch)}`
    );
  };

  return (
    <nav className="w-full bg-blue-700 text-white shadow-md">
      {/* ========================= */}
      {/* Desktop / Top Navbar */}
      {/* ========================= */}

      <div className="mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}

        <div
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-blue-700">
            <ShoppingCart
              size={25}
              strokeWidth={2.5}
            />
          </div>

          <div>
            <h1 className="text-xl font-bold leading-none">
              Shopping
              <span className="text-yellow-400">.</span>
            </h1>

            <p className="mt-1 text-sm text-blue-100">
              Your Shopping Store
            </p>
          </div>
        </div>

        {/* Right Section */}

        <div className="flex items-center gap-2 sm:gap-3">

          {/* Desktop Search */}

          <form
            onSubmit={handleSearch}
            className="hidden sm:flex"
          >
            <div className="relative">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search products..."
                className="h-10 w-56 rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              />
            </div>
          </form>

          {/* My Orders */}

          <button
            onClick={() => navigate("/orders")}
            className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium transition hover:bg-blue-600"
            aria-label="My Orders"
          >
            <Package size={20} />

            <span className="hidden md:inline">
              My Orders
            </span>
          </button>

          {/* Cart */}

          <button
            onClick={() => navigate("/cart")}
            className="relative flex h-10 items-center gap-2 rounded-lg px-3 transition hover:bg-blue-600"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={22} />

            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-400 px-1 text-xs font-bold text-blue-700">
              {totalProducts}
            </span>

            <span className="hidden text-sm font-medium md:inline">
              Cart
            </span>
          </button>

          {/* Logout */}

          <button
            onClick={handleLogout}
            className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium transition hover:bg-blue-600"
          >
            <LogOut size={20} />

            <span className="hidden sm:inline">
              Logout
            </span>
          </button>

        </div>
      </div>

      {/* ========================= */}
      {/* Mobile Search */}
      {/* ========================= */}

      <div className="border-t border-blue-600 px-4 py-3 sm:hidden">
        <form onSubmit={handleSearch}>
          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
            />

          </div>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;