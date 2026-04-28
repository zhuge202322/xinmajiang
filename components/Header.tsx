'use client';

import { ChevronDown, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 bg-wine-deeper text-cream">
      <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-8">
        <Link
          href="/"
          className="font-serif text-[28px] font-medium tracking-wide text-gold-light"
        >
          Luundy
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
          <Link
            href="/login"
            className={`transition-colors ${
              isActive('/login') || isActive('/register')
                ? 'text-gold'
                : 'text-cream/90 hover:text-gold'
            }`}
          >
            登录/注册
          </Link>
          <Link href="/cart" className="relative">
            <ShoppingCart size={22} />
            <span className="absolute -right-2 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gold text-[11px] font-medium text-wine-deeper">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
