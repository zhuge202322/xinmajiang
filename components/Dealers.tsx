import { MapPin, Search } from 'lucide-react';

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
          寻找您身边的 Luundy
        </h2>
        <p className="mt-3 text-[15px] text-wine-dark/70">
          查看全美所有经销商与自提仓库位置
        </p>

        {/* 地图卡片 */}
        <div className="card-gold mt-12 px-6 py-10">
          <p className="text-[14px] text-wine-dark/70">全美所有经销商与仓库分布图</p>

          <div className="relative mx-auto mt-6 h-[260px] max-w-[760px]">
            {/* 美国地图风格的 SVG 占位 */}
            <svg viewBox="0 0 760 260" className="h-full w-full">
              <ellipse
                cx="380"
                cy="130"
                rx="320"
                ry="100"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="0.8"
                opacity="0.5"
              />
              <ellipse
                cx="380"
                cy="130"
                rx="240"
                ry="70"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="0.6"
                opacity="0.4"
              />
              {/* 中央地图图标 */}
              <g transform="translate(340 95)">
                <rect width="80" height="80" rx="12" fill="#FAF1E0" stroke="#D4AF37" />
                <path
                  d="M40 22 Q24 22 24 38 Q24 52 40 62 Q56 52 56 38 Q56 22 40 22 Z"
                  fill="#9B7EBD"
                />
                <circle cx="40" cy="38" r="6" fill="#fff" />
              </g>
            </svg>

            {/* 标记点 */}
            <span className="absolute left-[15%] top-[55%] flex items-center gap-1 rounded-full bg-wine px-3 py-1 text-[12px] text-cream">
              <MapPin size={12} className="text-gold" /> 洛杉矶仓
            </span>
            <span className="absolute right-[15%] top-[45%] flex items-center gap-1 rounded-full bg-wine px-3 py-1 text-[12px] text-cream">
              <MapPin size={12} className="text-gold" /> 纽约仓
            </span>
          </div>

          <button className="btn-wine mt-8">
            <Search size={16} /> 搜索附近位置
          </button>
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
