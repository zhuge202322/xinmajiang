import { Ship, Warehouse, Check, Lightbulb } from 'lucide-react';

const options = [
  {
    icon: Ship,
    title: '海运直达',
    sub: '模式 A',
    items: ['全美免费配送，无需额外运费', '海运到家30-45天左右', '全程物流追踪'],
    tip: '适合不急用、追求性价比的客户',
  },
  {
    icon: Warehouse,
    title: '仓库自提',
    sub: '模式 B',
    items: ['现有库存立即提货', '支持全美多地仓库', '可选 fedex 全美派送到家'],
    tip: '适合急需使用、就近提货的客户',
  },
];

export default function Shipping() {
  return (
    <section className="diamond-bg-dark py-20">
      <div className="mx-auto max-w-[1280px] px-8 text-center">
        <h2 className="font-serif text-[40px] font-medium text-cream">
          两种配送方式，灵活选择
        </h2>
        <p className="mt-3 text-[15px] text-gold-light">为您提供最便捷的购物体验</p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {options.map(({ icon: Icon, title, sub, items, tip }) => (
            <div
              key={title}
              className="rounded-2xl border border-gold/60 bg-cream/95 p-8 shadow-card"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-wine text-gold-light">
                  <Icon size={26} />
                </div>
                <div>
                  <h3 className="font-serif text-[24px] font-medium text-wine-dark">
                    {title}
                  </h3>
                  <p className="text-[13px] text-wine-dark/60">{sub}</p>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {items.map((it) => (
                  <li key={it} className="flex items-center gap-3 text-[15px] text-wine-dark">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gold text-gold">
                      <Check size={12} />
                    </span>
                    {it}
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-lg border border-gold/40 bg-gold/10 p-3 text-[13px] text-wine-dark">
                <Lightbulb className="mr-1 inline -translate-y-px text-gold" size={14} />
                {tip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
