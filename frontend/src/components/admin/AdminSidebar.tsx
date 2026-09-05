import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import useAuthStore from "../../store/authstore";
import { auth } from "../../config/firebase";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const navLinks = [
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/admin/products",
      label: "Products",
      icon: Package,
    },
    {
      to: "/admin/categories",
      label: "Categories",
      icon: Tags,
    },
    {
      to: "/admin/orders",
      label: "Orders",
      icon: ShoppingCart,
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {/* =====================================================
          MOBILE TOP BAR
          Visible only below lg
      ===================================================== */}
      <div className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between bg-blue-700 px-4 text-white shadow-md lg:hidden">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400">
            <ShoppingCart size={18} className="text-blue-700" />
          </div>

          <h2 className="text-lg font-bold">
            Shopping<span className="text-yellow-400">.</span>
          </h2>
        </div>

        {/* Menu button */}
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 transition hover:bg-blue-600 active:scale-95"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
          
          Mobile:
          - fixed
          - slide in/out

          Desktop:
          - fixed to the viewport while page content scrolls
      ===================================================== */}
      <aside
        className={`
          flex
          h-screen
          w-64
          shrink-0
          flex-col
          bg-blue-700
          text-white
          shadow-xl

          /* Mobile */
          fixed
          left-0
          top-0
          z-50
          transition-transform
          duration-300
          ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          /* Desktop */
          lg:fixed
          lg:left-0
          lg:top-0
          lg:z-auto
          lg:translate-x-0
          lg:shadow-none
        `}
      >
        {/* =====================================================
            LOGO SECTION
        ===================================================== */}
        <div className="flex items-center justify-between border-b border-blue-500 px-6 py-6">
          <div className="flex items-center gap-2">
            {/* Logo icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-400">
              <ShoppingCart
                size={20}
                className="text-blue-700"
              />
            </div>

            {/* Logo text */}
            <div>
              <h2 className="text-xl font-bold">
                Shopping<span className="text-yellow-400">.</span>
              </h2>

              <p className="text-xs text-blue-200">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-1 hover:bg-blue-600 lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  px-4
                  py-3
                  font-medium
                  transition
                  hover:bg-blue-600
                "
              >
                <Icon size={20} />

                <span>{label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* =====================================================
            LOGOUT
        ===================================================== */}
        <div className="border-t border-blue-500 p-4">
          <button
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-4
              py-3
              font-medium
              transition
              hover:bg-blue-600
            "
          >
            <LogOut size={20} />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
