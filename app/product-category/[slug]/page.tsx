import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  categories,
  getAllStorefrontProducts,
  getStorefrontCategory,
  getStorefrontProductsByCategory,
} from '@/lib/storefront-products';
import PageHero from '@/components/PageHero';
import ProductListWithStockFilter from '@/components/ProductListWithStockFilter';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { stock?: string };
}) {
  const cat = await getStorefrontCategory(params.slug);
  if (!cat) notFound();

  const products = await getAllStorefrontProducts();
  const inCat = await getStorefrontProductsByCategory(params.slug);
  const list = inCat.length > 0 ? inCat : products.filter((p) => p.category !== params.slug).slice(0, 6);
  const usOnly = searchParams?.stock === 'us';

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
          <ProductListWithStockFilter products={list} initialUsOnly={usOnly} />
        </div>
      </section>
    </main>
  );
}
