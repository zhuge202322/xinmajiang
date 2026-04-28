// 通用页面头部（用于二级页面：标题 + 副标题）
export default function PageHero({
  title,
  enTitle,
  desc,
  tone = 'gold',
}: {
  title: string;
  enTitle?: string;
  desc?: string;
  tone?: 'gold' | 'wine' | 'cream';
}) {
  const bg =
    tone === 'wine'
      ? 'bg-wine-dark text-cream'
      : tone === 'gold'
      ? 'bg-gold text-wine-dark'
      : 'diamond-bg text-wine-dark';

  return (
    <section className={`${bg} px-8 py-16`}>
      <div className="mx-auto max-w-[1280px] text-center">
        <h1 className="font-serif text-[44px] font-medium leading-tight">{title}</h1>
        {enTitle && (
          <p className="mt-2 text-[16px] opacity-80">{enTitle}</p>
        )}
        {desc && (
          <p className="mx-auto mt-4 max-w-2xl text-[15px] opacity-90">{desc}</p>
        )}
      </div>
    </section>
  );
}
