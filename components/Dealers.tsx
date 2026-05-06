import { MapPin, Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Map = dynamic(() => import('./Map'), { ssr: false });

const stats = [
  { num: '3000+', label: '全年销售' },
  { num: '10+', label: '合作经销商' },
  { num: '48', label: '覆盖州数' },
];

export default function Dealers() {
  return (
    <section className="diamond-bg py-20">
      <div className="mx-auto max-w-[1280px] px-8 text-center">
        <h2 className="font-serif text-[40px] font-medium text-wine-dark">
          寻找您身边的 ZHONGQUE
        </h2>
        <p className="mt-3 text-[15px] text-wine-dark/70">
          查看全美所有经销商与自提仓库位置
        </p>

        {/* 地图卡片 */}
        <div className="card-gold mt-12 px-6 py-6">
          <p className="text-[14px] text-wine-dark/70">全美所有经销商与仓库分布图</p>

          <div className="relative mx-auto mt-6">
            <Map height="300px" />
          </div>

          <Link href="/dealer-locator" className="btn-wine mt-8 inline-flex">
            <Search size={16} /> 搜索附近位置
          </Link>
        </div>

        {/* 数字统计 */}
        <div className="mt-12 grid grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-serif text-[44px] font-medium text-gold">{s.num}</div>
              <div className="text-[14px] text-wine-dark/70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
