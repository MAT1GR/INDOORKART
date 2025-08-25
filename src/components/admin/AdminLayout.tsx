// mat1gr/indoorkart/INDOORKART-develop/src/components/admin/AdminLayout.tsx
import React, { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  Car,
  CreditCard,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  Clock,
  UserCog,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    path: "/admin/dashboard",
    icon: BarChart3,
    label: "Dashboard",
    roles: ["admin", "staff"],
  },
  {
    path: "/admin/bookings",
    icon: Calendar,
    label: "Reservas",
    roles: ["admin", "staff"],
  },
  {
    path: "/admin/timeslots",
    icon: Clock,
    label: "Horarios",
    roles: ["admin", "staff"],
  },
  {
    path: "/admin/karts",
    icon: Car,
    label: "Karts",
    roles: ["admin", "staff"],
  },
  { path: "/admin/plans", icon: CreditCard, label: "Planes", roles: ["admin"] },
  { path: "/admin/users", icon: UserCog, label: "Usuarios", roles: ["admin"] },
  {
    path: "/admin/settings",
    icon: Settings,
    label: "Configuración",
    roles: ["admin"],
  },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <div className="h-screen flex bg-gray-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 z-30
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-lg font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            🏎️ RIK Admin
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{user?.name}</div>
              <div className="text-sm text-gray-500 capitalize">
                {user?.role}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6">
          <ul className="space-y-1 px-3">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                      ${
                        isActive
                          ? "bg-red-50 text-red-700 font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center space-x-3 text-gray-600 hover:text-red-600 transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-4 ml-auto">
            <Link
              to="/"
              target="_blank"
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Ver sitio público →
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
