// src/components/Layout.jsx

import {
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  LayoutDashboard,
  Brain,
  User,
  LogOut,
} from "lucide-react";

const Layout = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const handleLogout = () => {

    localStorage.clear();

    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path;

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eef4ff] to-[#c7d2fe] p-4 overflow-hidden">

      {/* MAIN LAYOUT */}
      <div className="flex gap-4 h-[calc(100vh-32px)]">

        {/* SIDEBAR */}
        <aside className="w-72 bg-white/55 backdrop-blur-2xl border border-white/40 rounded-[32px] shadow-[0_8px_40px_rgba(59,130,246,0.12)] hidden md:flex flex-col justify-between p-7">

          {/* TOP */}
          <div>

            {/* LOGO */}
            <div className="mb-12">

              <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">

                HireMind AI

              </h2>

              <p className="text-sm text-gray-500 mt-2">

                AI Interview Platform

              </p>

            </div>

            {/* NAVIGATION */}
            <nav className="space-y-3">

              <SidebarItem
                icon={<LayoutDashboard size={20} />}
                active={isActive("/dashboard")}
                onClick={() =>
                  navigate("/dashboard")
                }
              >

                Dashboard

              </SidebarItem>

              <SidebarItem
                icon={<Brain size={20} />}
                active={isActive("/interviewprep")}
                onClick={() =>
                  navigate("/interviewprep")
                }
              >

                Interview Prep

              </SidebarItem>

              <SidebarItem
                icon={<User size={20} />}
                active={isActive("/profile")}
                onClick={() =>
                  navigate("/profile")
                }
              >

                Profile

              </SidebarItem>

            </nav>

          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-300 font-medium"
          >

            <LogOut size={18} />

            Logout

          </button>

        </aside>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto rounded-[32px]">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

/* ===================================== */
/* SIDEBAR ITEM */
/* ===================================== */

const SidebarItem = ({
  icon,
  children,
  active,
  onClick,
}) => {

  return (

    <div
      onClick={onClick}
      className={`group flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 font-medium ${
        active
          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-300/40 scale-[1.02]"
          : "text-gray-700 hover:bg-white/70 hover:shadow-md"
      }`}
    >

      <div
        className={`transition-all duration-300 ${
          active
            ? "text-white"
            : "text-gray-500 group-hover:text-blue-600"
        }`}
      >

        {icon}

      </div>

      <span className="text-[15px]">

        {children}

      </span>

    </div>
  );
};

export default Layout;