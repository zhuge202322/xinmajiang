import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Eye, Calendar } from 'lucide-react';
import { blogPosts, getPost } from '@/lib/blog';

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="diamond-bg py-12">
      <article className="mx-auto max-w-3xl px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-[13px] text-wine-dark/70 hover:text-wine"
        >
          <ArrowLeft size={14} /> 返回博客
        </Link>

        <span className="mt-6 inline-block rounded-md bg-wine px-3 py-1 text-[12px] text-cream">
          {post.tag}
        </span>
        <h1 className="mt-4 font-serif text-[36px] font-medium leading-tight text-wine-dark">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-5 text-[13px] text-wine-dark/60">
          <span className="inline-flex items-center gap-1">
            <Calendar size={14} /> {post.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye size={14} /> {post.views} 次阅读
          </span>
        </div>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border-2 border-gold">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="prose prose-wine mt-10 max-w-none">
          {post.content.map((para, i) => (
            <p key={i} className="mt-5 text-[16px] leading-[1.85] text-wine-dark">
              {para}
            </p>
          ))}
        </div>

        <div className="mt-16 border-t border-gold/30 pt-10">
          <h3 className="font-serif text-[24px] font-medium text-wine-dark">相关文章</h3>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="card-gold overflow-hidden transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-video">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    sizes="(min-width: 640px) 240px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="line-clamp-2 text-[14px] font-medium text-wine-dark">
                    {r.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
