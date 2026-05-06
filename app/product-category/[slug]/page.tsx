import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import {
  categories,
  getAllStorefrontProducts,
  getStorefrontCategory,
  getStorefrontProductsByCategory,
} from '@/lib/storefront-products';
import PageHero from '@/components/PageHero';
import ProductImage from '@/components/ProductImage';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = await getStorefrontCategory(params.slug);
  if (!cat) notFound();

  const products = await getAllStorefrontProducts();
  const inCat = await getStorefrontProductsByCategory(params.slug);
  const list = inCat.length > 0 ? inCat : products.filter((p) => p.category !== params.slug).slice(0, 6);

  return (
    <main>
      <PageHero title={cat.name} desc={cat.desc} tone="gold" />

      {/* 分类切换 */}
      <div className="diamond-bg-dark border-y border-gold/30 py-5">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/shop"
              className="rounded-md border border-cream/30 px-4 py-2 text-[14px] text-cream/85 hover:border-gold hover:text-gold"
            >
              全部机型
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/product-category/${c.slug}`}
                className={`rounded-md px-4 py-2 text-[14px] transition-colors ${
                  c.slug === params.slug
                    ? 'bg-cream text-wine-dark'
                    : 'border border-cream/30 text-cream/85 hover:border-gold hover:text-gold'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
          <select className="rounded-md border border-gold/40 bg-wine px-4 py-2 text-[13px] text-cream">
            <option>按销量排序</option>
            <option>价格从低到高</option>
            <option>价格从高到低</option>
            <option>最新上架</option>
          </select>
        </div>
      </div>

      {/* 商品网格 */}
      <section className="diamond-bg py-16">
        <div className="mx-auto max-w-[1280px] px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((p) => (
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
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-[20px] font-medium text-wine-dark">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-[13px] text-wine-dark/70">{p.shortDesc}</p>
                  <div className="mt-4 flex items-end justify-between">
                    <div className="flex items-end gap-2">
                      <span className="text-[13px] text-wine-dark/50 line-through">
                        ${p.original}
                      </span>
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
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
