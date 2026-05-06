import { Award, Heart, Globe, Users } from 'lucide-react';
import PageHero from '@/components/PageHero';

const values = [
  { icon: Award, title: '匠心品质', desc: '源头工厂直供，严格 18 道质检工序' },
  { icon: Heart, title: '海外华人', desc: '专为北美华人家庭使用习惯打造' },
  { icon: Globe, title: '全美服务', desc: '海运直达 + 仓库自提，覆盖 48 州' },
  { icon: Users, title: '终身保障', desc: '机芯终身质保，售后无忧' },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        title="关于 ZHONGQUE"
        enTitle="About ZHONGQUE"
        desc="专为海外华人打造的高端麻将机品牌，传承经典，创新体验。"
        tone="gold"
      />

      <section className="diamond-bg py-16">
        <div className="mx-auto max-w-3xl px-8 text-center text-wine-dark/85">
          <p className="text-[16px] leading-[1.9]">
            ZHONGQUE 起源于一个简单的愿望——让海外华人在异国他乡也能享受到一桌好麻将带来的家庭温情。
          </p>
          <p className="mt-4 text-[16px] leading-[1.9]">
            我们与中国头部自动麻将机工厂合作，为北美客户量身定制 110V 电压、英文操作面板、
            适配北美电源的专属机型，并在洛杉矶与纽约设立官方仓库，提供 30 分钟响应的本地售后服务。
          </p>
        </div>
      </section>

      <section className="diamond-bg-dark py-16">
        <div className="mx-auto max-w-[1280px] px-8">
          <h2 className="text-center font-serif text-[32px] font-medium text-cream">
            我们的承诺
          </h2>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center text-cream">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-wine-deeper text-gold">
                  <Icon size={26} />
                </div>
                <h3 className="mt-3 font-serif text-[18px] text-gold-light">{title}</h3>
                <p className="mt-1 text-[13px] text-cream/75">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="diamond-bg py-16">
        <div className="mx-auto max-w-[1280px] grid grid-cols-3 gap-6 px-8 text-center">
          {[
            { num: '3000+', label: '全年销售' },
            { num: '10+', label: '合作经销商' },
            { num: '48', label: '覆盖州数' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-serif text-[44px] font-medium text-gold">{s.num}</div>
              <div className="text-[14px] text-wine-dark/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
