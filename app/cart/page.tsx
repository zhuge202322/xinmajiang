'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Trash2, Tag, ArrowRight, ShoppingBag, Settings } from 'lucide-react';
import { products } from '@/lib/products';
import ProductImage from '@/components/ProductImage';

type CartItem = {
  slug: string;
  qty: number;
  configKey?: string;
  configuration?: Record<string, { label: string; price: number; id: string }>;
  price: number;
  productName: string;
  image?: string;
  color?: string;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState('');
  const [mounted, setMounted] = useState(false);

  // 初始加载
  useEffect(() => {
    const saved = localStorage.getItem('cartProducts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      } catch {
        setItems([]);
      }
    }
    setMounted(true);
  }, []);

  // 保存到localStorage (仅当mounted且有变化时)
  useEffect(() => {
    if (!mounted) return;
    
    if (items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(items.map(i => ({
        slug: i.slug,
        qty: i.qty,
        configKey: i.configKey,
        configuration: i.configuration,
        price: i.price,
        productName: i.productName,
        image: i.image,
        color: i.color,
      }))));
      localStorage.setItem('cartProducts', JSON.stringify(items));
    } else {
      localStorage.removeItem('cart');
      localStorage.removeItem('cartProducts');
    }
  }, [items, mounted]);

  // 监听其他组件的购物车更新
  useEffect(() => {
    const handleCartUpdate = () => {
      const saved = localStorage.getItem('cartProducts');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        } catch {
          setItems([]);
        }
      } else {
        setItems([]);
      }
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  // Calculate totals
  const subtotal = items.reduce((s, item) => s + item.price * item.qty, 0);
  const total = subtotal;

  const updateQty = (index: number, delta: number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], qty: Math.max(0, updated[index].qty + delta) };
    if (updated[index].qty === 0) {
      updated.splice(index, 1);
    }
    setItems(updated);
    if (updated.length === 0) {
      localStorage.removeItem('cart');
      localStorage.removeItem('cartProducts');
    }
    // Notify header
    window.dispatchEvent(new Event('cart-updated'));
  };

  const remove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    if (newItems.length === 0) {
      localStorage.removeItem('cart');
      localStorage.removeItem('cartProducts');
    }
    // Notify header
    window.dispatchEvent(new Event('cart-updated'));
  };

  const getProductInfo = (slug: string) => {
    return products.find(p => p.slug === slug);
  };

  // 显示加载状态直到客户端加载完成
  if (!mounted) {
    return (
      <main className="diamond-bg min-h-[60vh] py-16">
        <div className="mx-auto max-w-[1280px] px-8">
          <h1 className="text-center font-serif text-[40px] font-medium text-wine-dark">
            购物车 <span className="text-gold">Shopping Cart</span>
          </h1>
          <div className="mx-auto mt-3 h-px w-16 bg-gold" />
          <div className="mt-12 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="diamond-bg min-h-[60vh] py-16">
      <div className="mx-auto max-w-[1280px] px-8">
        <h1 className="text-center font-serif text-[40px] font-medium text-wine-dark">
          购物车 <span className="text-gold">Shopping Cart</span>
        </h1>
        <div className="mx-auto mt-3 h-px w-16 bg-gold" />
        <p className="mt-6 text-center text-[14px] text-wine-dark/70">
          您的自动麻将机选购清单 · 所有商品均享受全美包邮与一年质保
        </p>

        {items.length === 0 ? (
          <div className="mx-auto mt-12 max-w-md rounded-2xl border border-gold/40 bg-white p-10 text-center shadow-card">
            <ShoppingBag className="mx-auto text-gold" size={48} />
            <p className="mt-4 text-[16px] text-wine-dark">您的购物车还是空的</p>
            <Link href="/" className="btn-wine mt-6 inline-flex">
              去逛逛 <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 商品列表 */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => {
                const product = getProductInfo(item.slug);
                return (
                  <div
                    key={`${item.slug}-${item.configKey || 'default'}-${index}`}
                    className="card-gold flex flex-col sm:flex-row gap-4 p-4"
                  >
                    <Link
                      href={`/product/${item.slug}`}
                      className="aspect-square w-full sm:w-32 shrink-0 overflow-hidden rounded-md bg-cream2"
                    >
                      <ProductImage
                        src={item.image || product?.images[0] || ''}
                        color={item.color || product?.color}
                        label={item.productName || product?.name || ''}
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-serif text-[18px] font-medium text-wine-dark hover:text-wine"
                      >
                        {item.productName || product?.name}
                      </Link>

                      {/* Configuration Details */}
                      {item.configuration && Object.keys(item.configuration).length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[12px] text-wine-dark/60">
                            <Settings size={12} /> 已选配置:
                          </span>
                          {Object.entries(item.configuration).map(([key, val]) => (
                            <span
                              key={key}
                              className="inline-flex items-center gap-1 rounded bg-cream2 px-2 py-0.5 text-[11px] text-wine-dark"
                            >
                              {val.label}
                              {val.price > 0 && (
                                <span className="text-wine">+${val.price}</span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="mt-1 text-[13px] text-wine-dark/60">
                        {product?.shortDesc}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-md border border-gold/40">
                          <button
                            onClick={() => updateQty(index, -1)}
                            className="px-3 py-1 text-wine-dark"
                          >
                            −
                          </button>
                          <span className="border-x border-gold/30 px-4 py-1 text-wine-dark">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(index, 1)}
                            className="px-3 py-1 text-wine-dark"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-serif text-[20px] text-wine">
                            ${item.price * item.qty}
                          </span>
                          <button
                            onClick={() => remove(index)}
                            className="text-wine-dark/50 hover:text-wine"
                            aria-label="删除"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 订单摘要 */}
            <aside className="card-gold h-max p-6">
              <h2 className="font-serif text-[22px] font-medium text-wine-dark">
                订单摘要
              </h2>

              {/* 优惠码 */}
              <div className="mt-6">
                <p className="mb-2 text-[13px] text-wine-dark/70">优惠码</p>
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="WELCOME50"
                    className="flex-1 rounded-md border border-gold/40 bg-cream2 px-3 py-2 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:border-wine focus:outline-none"
                  />
                  <button className="rounded-md bg-wine px-4 text-[13px] text-cream">
                    应用
                  </button>
                </div>
                <p className="mt-2 inline-flex items-center gap-1 text-[12px] text-gold">
                  <Tag size={12} /> 新客可用 WELCOME50 立减 $50
                </p>
              </div>

              <div className="my-6 border-t border-gold/30" />

              {/* Item Details */}
              <div className="space-y-2 text-[14px]">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-wine-dark/80">
                    <span>
                      {item.productName} x{item.qty}
                    </span>
                    <span>${item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 text-[14px]">
                <div className="flex justify-between text-wine-dark/80">
                  <span>商品小计</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-wine-dark/80">
                  <span>运费</span>
                  <span className="text-gold">免费</span>
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between border-t border-gold/30 pt-4">
                <span className="text-[14px] text-wine-dark/70">合计</span>
                <span className="font-serif text-[28px] font-medium text-wine">
                  ${total}
                </span>
              </div>

              <Link
                href="/checkout"
                className="btn-wine mt-6 w-full justify-center"
              >
                前往结算 <ArrowRight size={16} />
              </Link>
              <Link
                href="/"
                className="mt-3 block text-center text-[13px] text-wine-dark/70 hover:text-wine"
              >
                继续购物
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
