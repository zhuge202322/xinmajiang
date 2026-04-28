import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  RefreshCcw,
  ShieldCheck,
  Truck,
  Lock,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { policies, policyList } from '@/lib/policies';

const iconMap = {
  refund: RefreshCcw,
  warranty: ShieldCheck,
  shipping: Truck,
  privacy: Lock,
} as const;

export function generateStaticParams() {
  return policyList.map((p) => ({ slug: p.slug }));
}

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const doc = policies[params.slug];
  if (!doc) notFound();
  const Icon = iconMap[doc.slug as keyof typeof iconMap] ?? ShieldCheck;

  return (
    <main className="diamond-bg py-12">
      <div className="mx-auto max-w-3xl px-8">
        <p className="text-[14px] leading-relaxed text-wine-dark/80">{doc.intro}</p>

        <article className="mt-8 rounded-2xl border border-gold/40 bg-white p-10 shadow-card">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream2 text-wine">
              <Icon size={26} />
            </div>
            <h1 className="mt-5 font-serif text-[32px] font-medium text-wine">
              {doc.title}
            </h1>
            <p className="mt-1 text-[14px] text-wine-dark/70">{doc.enTitle}</p>
            <p className="mt-3 inline-flex items-center gap-1 text-[12px] text-wine-dark/55">
              <Calendar size={12} /> 生效日期：{doc.effective}
            </p>
          </div>

          <div className="my-8 border-t border-gold/30" />

          {/* 重要提示横幅 */}
          <div className="rounded-md border-l-4 border-gold bg-cream2 p-4 text-[13px] text-wine-dark/80">
            <Sparkles size={14} className="mr-1 inline -translate-y-px text-gold" />
            请在下单前仔细阅读以下条款，下单即视为同意。
          </div>

          {/* 章节 */}
          <div className="mt-8 space-y-8">
            {doc.sections.map((s, i) => (
              <section key={s.heading}>
                <h2 className="inline-flex items-center gap-2 font-serif text-[22px] font-medium text-wine-dark">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-gold/20 text-[12px] text-wine">
                    {i + 1}
                  </span>
                  {s.heading.replace(/^[一二三四五六七八九十]+、/, '')}
                </h2>
                {s.highlight && (
                  <div className="mt-3 inline-flex items-baseline gap-2 rounded-md bg-wine/5 px-3 py-1">
                    <span className="font-serif text-[20px] font-medium text-wine">
                      {s.highlight}
                    </span>
                  </div>
                )}
                <ul className="mt-3 space-y-2">
                  {s.body.map((b) => (
                    <li
                      key={b}
                      className="flex gap-2 text-[14px] leading-[1.8] text-wine-dark/85"
                    >
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {b}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </article>

        {/* 其它政策快捷入口 */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {policyList.map((p) => {
            const PIcon = iconMap[p.slug as keyof typeof iconMap] ?? ShieldCheck;
            return (
              <Link
                key={p.slug}
                href={`/policy/${p.slug}`}
                className={`flex flex-col items-center gap-2 rounded-md border p-4 text-center text-[13px] ${
                  p.slug === doc.slug
                    ? 'border-wine bg-cream2 text-wine'
                    : 'border-gold/40 text-wine-dark/80 hover:border-wine'
                }`}
              >
                <PIcon size={18} />
                {p.title}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
