'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRouter } from 'next/navigation';
import { FiPackage, FiSettings, FiList, FiLogOut, FiHome } from 'react-icons/fi';

export default function AdminNavbar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: FiHome },
    { href: '/admin/menu', label: 'Menu', icon: FiList },
    { href: '/admin/orders', label: 'Orders', icon: FiPackage },
    { href: '/admin/settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold">Admin Panel</span>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2"
            >
              <FiLogOut />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}



