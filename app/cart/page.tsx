'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Trash2, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { products } from '@/lib/products';
import ProductImage from '@/components/ProductImage';

type CartItem = { slug: string; qty: number };

export default function CartPage() {
  // 演示用：默认放两件商品
  const [items, setItems] = useState<CartItem[]>([
    { slug: 'lewanjiazhedie', qty: 1 },
    { slug: 'a8canzhuo', qty: 1 },
  ]);
  const [coupon, setCoupon] = useState('');

  const cartProducts = items
    .map((i) => {
      const p = products.find((pp) => pp.slug === i.slug);
      return p ? { ...p, qty: i.qty } : null;
    })
    .filter(Boolean) as (typeof products[number] & { qty: number })[];

  const subtotal = cartProducts.reduce((s, p) => s + p.price * p.qty, 0);
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  const updateQty = (slug: string, delta: number) =>
    setItems((prev) =>
      prev
        .map((i) =>
          i.slug === slug ? { ...i, qty: Math.max(0, i.qty + delta) } : i
        )
        .filter((i) => i.qty > 0)
    );

  const remove = (slug: string) =>
    setItems((prev) => prev.filter((i) => i.slug !== slug));

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

        {cartProducts.length === 0 ? (
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
              {cartProducts.map((p) => (
                <div
                  key={p.slug}
                  className="card-gold flex flex-col sm:flex-row gap-4 p-4"
                >
                  <Link
                    href={`/product/${p.slug}`}
                    className="aspect-square w-full sm:w-32 shrink-0 overflow-hidden rounded-md bg-cream2"
                  >
                    <ProductImage src={p.images[0]} color={p.color} label={p.name} />
                  </Link>
                  <div className="flex-1">
                    <Link
                      href={`/product/${p.slug}`}
                      className="font-serif text-[18px] font-medium text-wine-dark hover:text-wine"
                    >
                      {p.name}
                    </Link>
                    <p className="mt-1 text-[13px] text-wine-dark/60">{p.shortDesc}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-md border border-gold/40">
                        <button
                          onClick={() => updateQty(p.slug, -1)}
                          className="px-3 py-1 text-wine-dark"
                        >
                          −
                        </button>
                        <span className="border-x border-gold/30 px-4 py-1 text-wine-dark">
                          {p.qty}
                        </span>
                        <button
                          onClick={() => updateQty(p.slug, 1)}
                          className="px-3 py-1 text-wine-dark"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-serif text-[20px] text-wine">
                          ${p.price * p.qty}
                        </span>
                        <button
                          onClick={() => remove(p.slug)}
                          className="text-wine-dark/50 hover:text-wine"
                          aria-label="删除"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

              <div className="space-y-2 text-[14px]">
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
