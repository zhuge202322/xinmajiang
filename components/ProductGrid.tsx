'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories, getProductsByCategory } from '@/lib/products';

const categoryFeatureImages: Record<string, string> = {
  outdoor: '/img/huwai.jpg',
};

interface CategoryCardProps {
  slug: string;
  name: string;
  desc: string;
  productSlugs: string[];
}

function CategoryCard({ slug, name, desc, productSlugs }: CategoryCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const products = getProductsByCategory(slug);
  const featureImage = categoryFeatureImages[slug];

  // 收集该分类下所有产品的所有图片
  const allImages = [featureImage, ...products.flatMap((p) => p.images)].filter(Boolean);
  const hasImages = allImages.length > 0;
  const productCount = productSlugs.length;

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : allImages.length - 1));
  }, [allImages.length]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i < allImages.length - 1 ? i + 1 : 0));
  }, [allImages.length]);

  // 自动轮播
  useEffect(() => {
    if (allImages.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [allImages.length, next]);

  const goTo = (index: number) => setCurrentIndex(index);

  return (
    <Link
      href={`/product-category/${slug}`}
      className="group card-gold overflow-hidden transition-transform hover:-translate-y-1"
    >
      {/* 图片轮播区域 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream2">
        {hasImages ? (
          <>
            {/* 图片 */}
            <img
              src={allImages[currentIndex]}
              alt={name}
              className="h-full w-full object-cover transition-opacity duration-500"
            />

            {/* 左右箭头 */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    prev();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                  aria-label="上一张"
                >
                  <ChevronLeft size={20} className="text-wine-dark" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    next();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                  aria-label="下一张"
                >
                  <ChevronRight size={20} className="text-wine-dark" />
                </button>

                {/* 轮播指示点 */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        goTo(idx);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentIndex
                          ? 'w-5 bg-wine'
                          : 'w-2 bg-white/60 hover:bg-white'
                      }`}
                      aria-label={`切换到第${idx + 1}张`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          /* 无图片占位 */
          <div className="flex h-full items-center justify-center">
            <span className="text-wine-dark/30 text-sm">暂无图片</span>
          </div>
        )}
      </div>

      {/* 分类信息 */}
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-[20px] font-medium text-wine-dark">
            {name}
          </h3>
          <span className="btn-wine !py-2 !px-4 text-[13px]">
            查看详情 <ArrowRight size={14} />
          </span>
        </div>
        <p className="mt-2 text-[13px] text-wine-dark/60 line-clamp-2 leading-relaxed">
          {desc}
        </p>
        {productCount > 0 ? (
          <span className="mt-3 inline-block text-[12px] text-wine/70">
            {productCount} 款机型
          </span>
        ) : (
          <span className="mt-3 inline-block text-[12px] text-wine/40">
            敬请期待
          </span>
        )}
      </div>
    </Link>
  );
}

export default function ProductGrid() {
  return (
    <section id="product-categories" className="diamond-bg scroll-mt-20 py-20">
      <div className="mx-auto max-w-[1280px] px-8 text-center">
        <h2 className="font-serif text-[40px] font-medium text-wine-dark">
          产品分类
        </h2>
        <p className="mt-3 text-[15px] text-wine">
          专业品质，满足您的不同需求
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 text-left">
          {/* 分类卡片网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                slug={category.slug}
                name={category.name}
                desc={category.desc}
                productSlugs={category.productSlugs}
              />
            ))}
          </div>

          {/* 查看全部 */}
          <div className="mt-8 flex justify-center">
            <Link href="/shop" className="btn-wine inline-flex items-center gap-2">
              查看全部产品 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
