// src/components/Layout.jsx

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Brain, User, LogOut } from "lucide-react";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-6 hidden md:flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-10">
            HireMind AI
          </h2>

          <nav className="space-y-2">

            <SidebarItem
              icon={<LayoutDashboard size={18} />}
              active={isActive("/dashboard")}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </SidebarItem>

            <SidebarItem
              icon={<Brain size={18} />}
              active={isActive("/interviewprep")}
              onClick={() => navigate("/interviewprep")}
            >
              Interview Prep
            </SidebarItem>

            <SidebarItem
              icon={<User size={18} />}
              active={isActive("/profile")}
              onClick={() => navigate("/profile")}
            >
              Profile
            </SidebarItem>

          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 text-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      {/* PAGE CONTENT */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

/* Sidebar Item */
const SidebarItem = ({ icon, children, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm ${
        active
          ? "bg-blue-50 text-blue-600 font-semibold"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      {children}
    </div>
  );
};

export default Layout;