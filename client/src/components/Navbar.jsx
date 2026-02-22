import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { Menu, Bell, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800 w-full">
      {/* Sidebar */}
      <aside
        className={`bg-white w-64 border-r border-gray-200 flex flex-col fixed md:relative z-30 h-full transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center md:block">
          <div>
            <h1 className="text-xl font-bold text-indigo-900">LDRP-ITR</h1>
            <p className="text-sm text-indigo-500 font-medium">Student Portal</p>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700">
            <Menu size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {routes
            .filter((route) => route.showInNavbar)
            .map((route) => (
              <NavItem
                key={route.path}
                to={route.path}
                icon={route.icon}
                label={route.label}
                onClick={closeSidebar}
              />
            ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10 w-full">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700">
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                Welcome back, {user?.username || 'Student'}! 👋
              </h2>
              <p className="text-xs text-gray-500 hidden sm:block">
                Here's what's happening with your academics today.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-9 w-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm border-2 border-indigo-200">
              {(user?.username || 'S')[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, to, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`
      }
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </NavLink>
  );
};

export default Navbar;
