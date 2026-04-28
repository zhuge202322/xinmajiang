import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products, getProduct, getCategory } from '@/lib/products';
import ProductImage from '@/components/ProductImage';
import { getStepsForProduct } from '@/lib/configurator';
import ProductConfigurator from './config-client';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug);
  if (!p) notFound();
  const cat = getCategory(p.category);
  const steps = getStepsForProduct(p);

  return (
    <main className="diamond-bg pb-16">
      {/* 面包屑 */}
      <div className="mx-auto max-w-[1280px] px-8 pt-6 text-[13px] text-wine-dark/60">
        <Link href="/" className="hover:text-wine">
          首页
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/product-category/${p.category}`} className="hover:text-wine">
          {cat?.name ?? p.categoryName}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-wine-dark">{p.name}</span>
      </div>

      {/* 顶部产品 Hero（居中） */}
      <section className="relative px-8 pt-8">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="relative mx-auto inline-block">
            <div className="overflow-hidden rounded-2xl border-[3px] border-gold bg-cream shadow-card">
              <div className="aspect-square w-[300px]">
                <ProductImage src={p.images[0]} color={p.color} label={p.name} />
              </div>
            </div>
            <span className="absolute -bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-[12px] font-medium text-white shadow">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> 在线
            </span>
          </div>

          <h1 className="mt-8 font-serif text-[34px] font-medium text-wine-dark">
            {p.name}
          </h1>
          <p className="mt-2 text-[14px] text-wine-dark/70">{p.shortDesc}</p>

          <div className="mt-4 flex items-end justify-center gap-3">
            <span className="text-[15px] text-wine-dark/50 line-through">
              ${p.original}
            </span>
            <span className="font-serif text-[36px] font-medium text-wine">
              ${p.price}
            </span>
            <span className="rounded-md bg-wine px-2 py-1 text-[12px] text-cream">
              省 ${p.original - p.price}
            </span>
          </div>
        </div>
      </section>

      {steps.length > 0 ? (
        <ProductConfigurator product={p} steps={steps} />
      ) : (
        <div className="mx-auto mt-10 max-w-[600px] px-8">
          <div className="rounded-lg border border-gold/40 bg-cream2 p-6 text-center text-wine-dark">
            该型号暂无在线配置选项，请联系客服咨询。
          </div>
        </div>
      )}

      {/* 相关推荐 */}
      <section className="diamond-bg py-12">
        <div className="mx-auto max-w-[1280px] px-8">
          <h2 className="font-serif text-[24px] font-medium text-wine-dark">
            您可能也喜欢
          </h2>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-5">
            {products
              .filter((x) => x.slug !== p.slug)
              .slice(0, 4)
              .map((x) => (
                <Link
                  key={x.slug}
                  href={`/product/${x.slug}`}
                  className="card-gold overflow-hidden transition-transform hover:-translate-y-1"
                >
                  <div className="aspect-square">
                    <ProductImage src={x.images[0]} color={x.color} label={x.name} />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-[16px] font-medium text-wine-dark">
                      {x.name}
                    </h3>
                    <p className="mt-1 font-serif text-[20px] text-wine">${x.price}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
