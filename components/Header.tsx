'use client';

import { ChevronDown, ShoppingCart, User, LogOut, Settings, Package, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const shopMenu = [
  { label: '全部商品', href: '/shop' },
  { label: '折叠款四口机', href: '/product-category/folding-4mouth' },
  { label: '折叠款旋翼机', href: '/product-category/folding-rotary' },
  { label: '餐桌款四口机', href: '/product-category/table-4mouth' },
  { label: '餐桌款旋翼机', href: '/product-category/table-rotary' },
  { label: '户外麻将机', href: '/product-category/outdoor' },
];

const policyMenu = [
  { label: '退换货政策', href: '/policy/refund' },
  { label: '质保条款', href: '/policy/warranty' },
  { label: '配送说明', href: '/policy/shipping' },
  { label: '隐私政策', href: '/policy/privacy' },
];

export default function Header() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Read cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = Array.isArray(cart) ? cart.reduce((sum: number, item: any) => sum + (item.qty || 1), 0) : 0;
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };
    updateCartCount();
    setMounted(true);
    window.addEventListener('cart-updated', updateCartCount);
    return () => window.removeEventListener('cart-updated', updateCartCount);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-wine-deeper text-cream">
      <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-8">
        <Link href="/" className="flex items-center">
          <img src="/img/logo.png" alt="ZHONGQUE" className="h-10" />
        </Link>

        <nav className="hidden md:flex items-center gap-9 text-[15px]">
          {/* 商店 */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu('shop')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <Link
              href="/shop"
              className={`flex items-center gap-1 transition-colors ${
                pathname.startsWith('/product') || pathname.startsWith('/shop')
                  ? 'text-gold'
                  : 'text-cream/90 hover:text-gold'
              }`}
            >
              商店 <ChevronDown size={14} />
            </Link>
            {openMenu === 'shop' && (
              <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                <div className="w-56 rounded-md border border-gold/30 bg-wine-deeper py-2 shadow-xl">
                  {shopMenu.map((m) => (
                    <Link
                      key={m.href}
                      href={m.href}
                      className="block px-4 py-2 text-[14px] text-cream/85 hover:bg-wine hover:text-gold"
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/blog"
            className={`transition-colors ${
              isActive('/blog') ? 'text-gold' : 'text-cream/90 hover:text-gold'
            }`}
          >
            博客
          </Link>
          <Link
            href="/dealer-locator"
            className={`transition-colors ${
              isActive('/dealer-locator') ? 'text-gold' : 'text-cream/90 hover:text-gold'
            }`}
          >
            合作
          </Link>
          <Link
            href="/order-tracking"
            className={`transition-colors ${
              isActive('/order-tracking') ? 'text-gold' : 'text-cream/90 hover:text-gold'
            }`}
          >
            订单追踪
          </Link>

          {/* 服务条款 */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu('policy')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              className={`flex items-center gap-1 transition-colors ${
                pathname.startsWith('/policy') ? 'text-gold' : 'text-cream/90 hover:text-gold'
              }`}
            >
              服务条款 <ChevronDown size={14} />
            </button>
            {openMenu === 'policy' && (
              <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                <div className="w-44 rounded-md border border-gold/30 bg-wine-deeper py-2 shadow-xl">
                  {policyMenu.map((m) => (
                    <Link
                      key={m.href}
                      href={m.href}
                      className="block px-4 py-2 text-[14px] text-cream/85 hover:bg-wine hover:text-gold"
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-6 text-[15px]">
          {/* User Menu */}
          {!loading && (
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-cream/90 hover:text-gold transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-wine/50 flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <span className="hidden sm:inline">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-gold/30 bg-wine-deeper py-2 shadow-xl">
                      <div className="px-4 py-2 border-b border-gold/30 mb-2">
                        <p className="text-sm text-cream font-medium truncate">
                          {user.displayName || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-cream/50 truncate">{user.email}</p>
                      </div>
                      
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-cream/85 hover:bg-wine hover:text-gold"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={14} />
                        个人中心
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-cream/85 hover:bg-wine hover:text-gold"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package size={14} />
                        我的订单
                      </Link>

                      {/* Admin Link */}
                      {user.isAdmin && (
                        <>
                          <div className="border-t border-gold/30 my-2" />
                          <Link
                            href="/admin/products"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gold hover:bg-wine"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LayoutDashboard size={14} />
                            管理后台
                          </Link>
                        </>
                      )}

                      <div className="border-t border-gold/30 mt-2 pt-2" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20"
                      >
                        <LogOut size={14} />
                        退出登录
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className={`flex items-center gap-2 transition-colors ${
                    isActive('/login') || isActive('/register')
                      ? 'text-gold'
                      : 'text-cream/90 hover:text-gold'
                  }`}
                >
                  <User size={18} />
                  <span className="hidden sm:inline">登录/注册</span>
                </Link>
              )}
            </div>
          )}

          <Link href="/cart" className="relative">
            <ShoppingCart size={22} />
            {mounted && cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gold text-[11px] font-medium text-wine-deeper">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
