import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Headphones, Star } from 'lucide-react';
import { categories, products } from '@/lib/products';
import PageHero from '@/components/PageHero';
import ProductImage from '@/components/ProductImage';

export const metadata = {
  title: '商店 Shop | Luundy 自动麻将机',
  description: 'Luundy 全系列自动麻将机：折叠款、餐桌款、旋翼机芯、户外便携，应有尽有。',
};

export default function ShopPage() {
  const featured = products.slice(0, 3);

  return (
    <main>
      <PageHero
        title="Luundy 商店"
        enTitle="Shop · 全系列自动麻将机"
        desc="折叠款、餐桌款、旋翼机芯、户外便携——总有一款适合您家。全美包邮，一年质保。"
        tone="gold"
      />

      {/* 分类导航卡片 */}
      <section className="diamond-bg py-16">
        <div className="mx-auto max-w-[1280px] px-8">
          <div className="text-center">
            <span className="pill-decor">按机型选购 Browse by Category</span>
            <h2 className="mt-4 font-serif text-[34px] font-medium text-wine-dark">
              选择您喜欢的机型
            </h2>
            <div className="mx-auto mt-3 h-px w-16 bg-gold" />
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c) => {
              const sample = products.find((p) => p.category === c.slug);
              return (
                <Link
                  key={c.slug}
                  href={`/product-category/${c.slug}`}
                  className="card-gold group overflow-hidden transition-transform hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3]">
                    <ProductImage src={sample?.images[0]} color={sample?.color || '#7B5DA8'} label={c.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-wine-deeper/60 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-md bg-wine px-3 py-1 text-[12px] text-cream">
                      {c.name}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-[22px] font-medium text-wine-dark">
                      {c.name}
                    </h3>
                    <p className="mt-1 text-[13px] text-wine-dark/60">{c.enDesc}</p>
                    <p className="mt-3 text-[14px] leading-relaxed text-wine-dark/80">
                      {c.desc}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[13px] text-wine group-hover:text-gold">
                      查看该系列 <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 热销精选 */}
      <section className="diamond-bg-dark py-16">
        <div className="mx-auto max-w-[1280px] px-8">
          <div className="text-center">
            <span className="pill-decor-dark">热销精选 Best Sellers</span>
            <h2 className="mt-4 font-serif text-[34px] font-medium text-cream">
              人气王者，闭眼入也不亏
            </h2>
            <div className="mx-auto mt-3 h-px w-16 bg-gold" />
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((p) => (
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
                  <div className="flex items-center gap-1 text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#D4AF37" strokeWidth={0} />
                    ))}
                    <span className="ml-1 text-[12px] text-wine-dark/60">
                      4.9 / 1280+ 评价
                    </span>
                  </div>
                  <h3 className="mt-2 font-serif text-[20px] font-medium text-wine-dark">
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
                      立即查看 <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 服务承诺 */}
      <section className="diamond-bg py-16">
        <div className="mx-auto max-w-[1280px] px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                Icon: Truck,
                title: '全美免费配送',
                desc: '下单后 3-7 个工作日送达，签收前可改地址',
              },
              {
                Icon: ShieldCheck,
                title: '一年整机质保',
                desc: '核心机芯终身免费维修，远程客服 7×24',
              },
              {
                Icon: Headphones,
                title: '中文售后服务',
                desc: '微信、电话、邮箱 多渠道华语支持',
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="card-gold p-6 text-center">
                <Icon className="mx-auto text-gold" size={36} />
                <h3 className="mt-3 font-serif text-[20px] font-medium text-wine-dark">
                  {title}
                </h3>
                <p className="mt-2 text-[13px] text-wine-dark/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
