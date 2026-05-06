import Link from 'next/link';
import { Eye, Sparkles, Mail } from 'lucide-react';
import { blogPosts, blogTags } from '@/lib/blog';

export default function BlogIndexPage() {
  return (
    <main className="diamond-bg py-12">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 lg:grid-cols-3 gap-8 px-8">
        {/* 主内容 */}
        <div className="lg:col-span-2">
          {/* 头部卡片 */}
          <section className="rounded-2xl border-l-4 border-gold bg-gradient-to-br from-cream2 to-cream p-8 shadow-card">
            <span className="inline-block rounded-full bg-wine/10 px-3 py-1 text-[12px] text-wine">
              ZHONGQUE 博客
            </span>
            <h1 className="mt-4 font-serif text-[40px] font-medium text-wine-dark">
              传承中式生活美学
            </h1>
            <p className="mt-3 max-w-xl text-[14px] text-wine-dark/70">
              探索麻将文化的深厚底蕴，分享选购维护的专业知识，记录海外华人的温馨故事。
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-[13px] text-gold">
              <Sparkles size={14} /> 专为海外华人打造的品质生活指南
            </p>
          </section>

          {/* 标签 */}
          <div className="mt-6 flex flex-wrap gap-2">
            {blogTags.map((t, i) => (
              <button
                key={t}
                className={`rounded-md px-4 py-1.5 text-[13px] transition-colors ${
                  i === 0
                    ? 'bg-wine text-cream'
                    : 'border border-gold/40 text-wine-dark/85 hover:border-wine hover:text-wine'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* 文章列表 */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {blogPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="card-gold overflow-hidden transition-transform hover:-translate-y-1"
              >
                <div
                  className="relative aspect-[4/3]"
                  style={{ background: p.cover }}
                >
                  <span className="absolute left-4 top-4 rounded-md bg-wine px-3 py-1 text-[12px] text-cream">
                    {p.tag}
                  </span>
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[12px] text-cream">
                    <Eye size={12} /> {p.views}
                  </span>
                  {/* 装饰线条 */}
                  <svg
                    viewBox="0 0 400 300"
                    className="absolute inset-0 h-full w-full opacity-20"
                  >
                    <path
                      d="M0 200 Q100 150 200 200 T400 200"
                      stroke="#fff"
                      strokeWidth="1"
                      fill="none"
                    />
                    <path
                      d="M0 240 Q100 200 200 240 T400 240"
                      stroke="#fff"
                      strokeWidth="1"
                      fill="none"
                    />
                  </svg>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-[18px] font-medium text-wine-dark line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-wine-dark/70 line-clamp-2">
                    {p.excerpt}
                  </p>
                  <p className="mt-3 text-[12px] text-wine-dark/55">{p.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 侧边栏 */}
        <aside className="space-y-6">
          <div className="card-gold p-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-wine">
              <span className="font-serif text-[36px] text-gold-light">L</span>
            </div>
            <h3 className="mt-4 font-serif text-[20px] font-medium text-wine">ZHONGQUE</h3>
            <p className="mt-2 text-[13px] text-gold">
              专为海外华人传承的中式生活美学
            </p>
            <p className="mt-3 text-[13px] text-wine-dark/70">
              ZHONGQUE 致力于为全球华人家庭提供高品质的自动麻将机，让传统文化在海外延续。
            </p>
            <button className="btn-wine mt-5 w-full justify-center text-[13px]">
              小红书关注
            </button>
          </div>

          <div className="card-gold p-6">
            <h3 className="inline-flex items-center gap-2 font-serif text-[18px] font-medium text-wine-dark">
              <Mail size={16} /> 订阅资讯
            </h3>
            <p className="mt-2 text-[12px] text-wine-dark/70">
              获取最新产品资讯、促销活动和麻将文化分享
            </p>
            <input
              placeholder="您的邮箱地址"
              className="mt-4 w-full rounded-md border border-gold/40 bg-cream2 px-3 py-2 text-[13px] text-wine-dark focus:border-wine focus:outline-none"
            />
            <button className="btn-wine mt-3 w-full justify-center text-[13px]">
              立即订阅
            </button>
            <p className="mt-2 text-[11px] text-wine-dark/55">
              我们尊重您的隐私，绝不发送垃圾邮件
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
