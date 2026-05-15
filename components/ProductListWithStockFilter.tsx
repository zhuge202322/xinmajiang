'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import ProductImage from '@/components/ProductImage';
import type { Product } from '@/lib/products';

type Props = {
  products: Product[];
  initialUsOnly?: boolean;
};

export default function ProductListWithStockFilter({ products, initialUsOnly = false }: Props) {
  const [usOnly, setUsOnly] = useState(initialUsOnly);

  const usCount = useMemo(
    () => products.filter((p) => (p.shippingMethods ?? []).includes('pickup')).length,
    [products],
  );

  const list = useMemo(
    () =>
      usOnly
        ? products.filter((p) => (p.shippingMethods ?? []).includes('pickup'))
        : products,
    [products, usOnly],
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-md border border-gold/40 bg-cream2 p-1">
          <button
            type="button"
            onClick={() => setUsOnly(false)}
            className={`px-4 py-1.5 text-[13px] rounded transition-colors ${
              !usOnly ? 'bg-wine text-cream' : 'text-wine-dark hover:text-wine'
            }`}
          >
            查看全部产品（{products.length}）
          </button>
          <button
            type="button"
            onClick={() => setUsOnly(true)}
            className={`px-4 py-1.5 text-[13px] rounded transition-colors ${
              usOnly ? 'bg-wine text-cream' : 'text-wine-dark hover:text-wine'
            }`}
          >
            仅看美国有货（{usCount}）
          </button>
        </div>
        {usOnly && (
          <p className="text-[12px] text-wine-dark/60">
            仅显示美国本地仓库现货商品（支持仓库自提）。
          </p>
        )}
      </div>

      {list.length === 0 ? (
        <div className="card-gold flex flex-col items-center justify-center gap-3 py-16 text-center">
          <AlertTriangle className="text-gold" size={28} />
          <p className="text-[15px] text-wine-dark">
            当前筛选条件下暂无商品。
          </p>
          {usOnly && (
            <button
              type="button"
              onClick={() => setUsOnly(false)}
              className="btn-wine inline-flex items-center gap-2"
            >
              查看全部产品 <ArrowRight size={14} />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => {
            const inUsStock = (p.shippingMethods ?? []).includes('pickup');
            return (
              <Link
                key={p.slug}
                href={`/product/${p.slug}`}
                className="card-gold overflow-hidden transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-square">
                  <ProductImage src={p.images[0]} color={p.color} label={p.name} />
                  {p.badges?.map((b, i) => (
                    <span
                      key={b}
                      className="absolute left-4 rounded-md bg-wine px-3 py-1 text-[12px] text-cream"
                      style={{ top: 16 + i * 32 }}
                    >
                      {b}
                    </span>
                  ))}
                  <span
                    className={`absolute right-4 top-4 rounded-md px-2 py-1 text-[11px] font-medium ${
                      inUsStock
                        ? 'bg-emerald-600/90 text-white'
                        : 'bg-amber-500/90 text-white'
                    }`}
                  >
                    {inUsStock ? '美国有货' : '美国无货 · 海运'}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-[20px] font-medium text-wine-dark">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-[13px] text-wine-dark/70">{p.shortDesc}</p>
                  <div className="mt-4 flex items-end justify-between">
                    <div className="flex items-end gap-2">
                      {p.original > p.price && (
                        <span className="text-[13px] text-wine-dark/50 line-through">
                          ${p.original}
                        </span>
                      )}
                      <span className="font-serif text-[26px] font-medium text-wine">
                        ${p.price}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[13px] text-wine">
                      查看详情 <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
