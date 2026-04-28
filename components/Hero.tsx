import { LayoutGrid, MapPin, Settings } from 'lucide-react';

export default function Hero() {
  return (
    <section className="diamond-bg relative overflow-hidden">
      {/* 装饰圆环 */}
      <div className="pointer-events-none absolute left-12 top-16 h-44 w-44 rounded-full border border-gold/40" />
      <div className="pointer-events-none absolute left-[120px] top-[110px] h-px w-44 bg-gold/40 rotate-45" />

      <div className="mx-auto grid max-w-[1280px] grid-cols-1 lg:grid-cols-2 gap-10 px-8 py-20 lg:py-28">
        {/* 左侧文案 */}
        <div className="flex flex-col justify-center">
          <span className="pill-decor mb-6 self-start">匠心之造 · 品质传承</span>

          <h1 className="font-serif text-[56px] leading-[1.15] font-medium text-wine-dark">
            Luundy，重新定义
            <br />
            海外华人的
            <span className="text-gradient">麻将体验</span>
          </h1>

          <p className="mt-6 text-[16px] text-wine-dark/85">
            源头工厂直供 <span className="mx-2 text-gold">|</span> 支持全美派送
            <span className="mx-2 text-gold">|</span> 仓库现货自提
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="btn-wine">
              <LayoutGrid size={18} /> 浏览全系产品
            </button>
            <button className="btn-wine-outline">
              <MapPin size={18} /> 附近提货/经销商
            </button>
            <button className="btn-gold">
              <Settings size={18} /> 快速配置麻将机
            </button>
          </div>
        </div>

        {/* 右侧图片 */}
        <div className="relative">
          <div className="relative aspect-[576/563] overflow-hidden rounded-[20px] border-[3px] border-gold shadow-card">
            {/* 占位图：温馨家庭麻将场景 */}
            <svg
              viewBox="0 0 576 563"
              className="h-full w-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#5a3a2a" />
                  <stop offset="50%" stopColor="#3a2418" />
                  <stop offset="100%" stopColor="#1f140d" />
                </linearGradient>
                <radialGradient id="fire" cx="0.85" cy="0.6" r="0.2">
                  <stop offset="0%" stopColor="#ff8a3d" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <rect width="576" height="563" fill="url(#heroBg)" />
              <rect width="576" height="563" fill="url(#fire)" />
              {/* 桌面 */}
              <ellipse cx="280" cy="380" rx="160" ry="48" fill="#2a1810" opacity="0.6" />
              <circle cx="280" cy="350" r="120" fill="#f4ead8" />
              <circle cx="280" cy="350" r="100" fill="#3a2418" />
              <circle cx="280" cy="350" r="42" fill="#1a1008" />
              <text
                x="288"
                y="540"
                textAnchor="middle"
                fill="#fff"
                opacity="0.5"
                fontSize="14"
                fontFamily="sans-serif"
              >
                温馨家庭麻将场景 · Hero Image Placeholder
              </text>
            </svg>
          </div>

          <div className="mt-4 text-center">
            <span className="text-[15px] text-wine-dark/70">乐享欢聚，品质生活</span>
          </div>
        </div>
      </div>
    </section>
  );
}
