import { Package, MapPin, Truck, ShieldCheck } from 'lucide-react';

const features = [
  { icon: Package, title: '木架包装', desc: '破损率低' },
  { icon: MapPin, title: '附近提货', desc: '仓库直取' },
  { icon: Truck, title: '全美包邮', desc: '省心到家' },
  { icon: ShieldCheck, title: '终身质保', desc: '配件无忧' },
];

export default function FeatureBar() {
  return (
    <section className="diamond-bg-dark border-y border-gold/30 py-10">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 md:grid-cols-4 gap-6 px-8">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex flex-col items-center gap-2 text-cream"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/70 bg-white/10 text-gold">
              <Icon size={26} />
            </div>
            <h3 className="text-[18px] font-medium text-gold-light">{title}</h3>
            <p className="text-[13px] text-cream/90">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
