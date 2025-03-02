import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, Home, Users } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
    { path: '/clients', label: 'Clientes', icon: <Users className="w-5 h-5" /> },
    { path: '/reports', label: 'Reportes', icon: <BarChart3 className="w-5 h-5" /> },
    { path: '/export', label: 'Exportar', icon: <FileText className="w-5 h-5" /> }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Nicea Budget</h1>
          <p className="text-xs text-gray-500">Kinetic Corp</p>
        </div>
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                    location.pathname === item.path ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;