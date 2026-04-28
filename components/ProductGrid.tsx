import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories, products } from '@/lib/products';
import ProductImage from './ProductImage';

// 首页"品质匠选"区：每个分类挑一款代表机型展示
export default function ProductGrid() {
  const samples = categories
    .map((c) => {
      const sample = products.find((p) => p.category === c.slug);
      return sample
        ? { category: c, product: sample }
        : { category: c, product: null };
    });

  return (
    <section className="diamond-bg py-20">
      <div className="mx-auto max-w-[1280px] px-8 text-center">
        <h2 className="font-serif text-[40px] font-medium text-wine-dark">
          品质匠选，甄选机型
        </h2>
        <p className="mt-3 text-[15px] text-wine">
          精选五种麻将机，满足不同场景需求
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {samples.map(({ category, product }) => (
            <Link
              key={category.slug}
              href={
                product ? `/product/${product.slug}` : `/product-category/${category.slug}`
              }
              className="card-gold overflow-hidden transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-square overflow-hidden bg-cream2">
                <ProductImage
                  src={product?.images[0]}
                  color={product?.color}
                  label={product?.name || category.name}
                />
                <span className="absolute left-4 top-4 rounded-md bg-wine px-3 py-1 text-[12px] text-cream">
                  {category.name}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-[20px] font-medium text-wine-dark">
                  {product?.name || category.name}
                </h3>
                <p className="mt-1 text-[13px] text-wine-dark/70">
                  {product?.shortDesc || category.desc}
                </p>
                <div className="mt-4 flex items-end justify-between">
                  {product ? (
                    <div className="flex items-end gap-2">
                      <span className="text-[13px] text-wine-dark/50 line-through">
                        ${product.original}
                      </span>
                      <span className="font-serif text-[26px] font-medium text-wine">
                        ${product.price}
                      </span>
                      <span className="mb-1 text-[12px] text-wine-dark/60">起</span>
                    </div>
                  ) : (
                    <span className="text-[14px] text-wine-dark/60">敬请期待</span>
                  )}
                  <span className="btn-wine !py-2 !px-4 text-[13px]">
                    查看详情 <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
