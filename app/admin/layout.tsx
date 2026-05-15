'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  CreditCard,
  Menu,
  X,
  LogOut,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { href: '/admin', label: '控制台', icon: LayoutDashboard },
  { href: '/admin/products', label: '商品管理', icon: Package },
  { href: '/admin/orders', label: '订单管理', icon: ShoppingCart },
  { href: '/admin/users', label: '用户管理', icon: Users },
  { href: '/admin/payments', label: '支付管理', icon: CreditCard },
  { href: '/admin/settings', label: '系统设置', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Loader2 size={32} className="animate-spin text-purple-700" />
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 px-4 text-center">
        <ShieldAlert size={48} className="text-red-500" />
        <h1 className="text-xl font-bold text-gray-900">无权访问</h1>
        <p className="text-gray-600">该页面仅限管理员访问。</p>
        <button
          onClick={() => router.push('/login?next=' + encodeURIComponent(pathname) + '&denied=1')}
          className="mt-2 rounded-lg bg-purple-700 px-5 py-2 text-white hover:bg-purple-800"
        >
          切换管理员账户
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="ml-4 flex items-center gap-2">
          <span className="font-bold text-xl text-purple-700">中雀麻将</span>
          <span className="text-gray-500 text-sm">管理后台</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Link 
            href="/" 
            className="text-sm text-gray-600 hover:text-purple-700"
          >
            查看网站
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700">
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">管理员</span>
            <span className="font-medium">{user.displayName || user.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600"
          >
            <LogOut size={16} />
            退出登录
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside 
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-20 ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-64 lg:-translate-x-full'
        } overflow-hidden`}
      >
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-purple-50 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main 
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
