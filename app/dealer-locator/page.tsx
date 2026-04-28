import { Search, MapPin, Building2, Warehouse, Phone, Clock } from 'lucide-react';

const dealers = [
  {
    region: '洛杉矶地区',
    count: 2,
    items: [
      {
        type: '官方仓库',
        name: 'Luundy 洛杉矶仓',
        address: '8888 Industrial Way, Los Angeles, CA 90001',
        phone: '+1 (213) 555-0188',
        hours: '周一至周日 9:00–18:00 PST',
        stock: '库存充足',
        official: true,
      },
      {
        type: '授权经销商',
        name: '华美家居 LA 旗舰店',
        address: '1234 Garvey Ave, Monterey Park, CA 91754',
        phone: '+1 (626) 555-0123',
        hours: '周一至周六 10:00–19:00',
        stock: '库存充足',
      },
    ],
  },
  {
    region: '纽约地区',
    count: 2,
    items: [
      {
        type: '官方仓库',
        name: 'Luundy 纽约仓',
        address: '50-12 Northern Blvd, Long Island City, NY 11101',
        phone: '+1 (718) 555-0144',
        hours: '周一至周日 9:00–18:00 EST',
        stock: '库存充足',
        official: true,
      },
      {
        type: '授权经销商',
        name: '法拉盛旗舰展厅',
        address: '136-20 38th Ave, Flushing, NY 11354',
        phone: '+1 (917) 555-0155',
        hours: '每天 10:00–20:00',
        stock: '可订货',
      },
    ],
  },
  {
    region: '休斯顿地区',
    count: 1,
    items: [
      {
        type: '授权经销商',
        name: '德州中华家具',
        address: '9889 Bellaire Blvd, Houston, TX 77036',
        phone: '+1 (713) 555-0166',
        hours: '周一至周日 10:00–19:00 CST',
        stock: '可订货',
      },
    ],
  },
];

export default function DealerLocatorPage() {
  return (
    <main className="diamond-bg py-10">
      {/* 头部红卡 */}
      <section className="mx-auto max-w-[1280px] px-8">
        <div className="rounded-2xl bg-wine-dark p-10 text-cream">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-[40px] font-medium">
                寻找您身边的 <span className="text-gold-light">Luundy</span>
              </h1>
              <p className="mt-2 text-[14px] text-cream/80">
                查看全美授权经销商与自提仓库位置
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-wine-deeper px-4 py-2 text-[14px] text-gold-light">
              <MapPin size={16} /> 全美 5 个服务点
            </div>
          </div>
        </div>
      </section>

      {/* 主体 */}
      <section className="mx-auto mt-8 grid max-w-[1280px] grid-cols-1 lg:grid-cols-3 gap-6 px-8">
        {/* 左：搜索 + 列表 */}
        <div className="space-y-5">
          <div className="card-gold p-5">
            <h2 className="inline-flex items-center gap-2 font-medium text-wine-dark">
              <Search size={16} /> 搜索与筛选
            </h2>
            <input
              placeholder="输入邮编或城市名..."
              className="mt-4 w-full rounded-md border border-gold/40 bg-cream2 px-3 py-2 text-[14px] focus:border-wine focus:outline-none"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip label="全部" active />
              <Chip label="官方仓库" />
              <Chip label="授权经销商" />
            </div>
            <button className="btn-wine-outline mt-3 w-full justify-center text-[13px]">
              <MapPin size={14} /> 使用我的位置
            </button>
          </div>

          {dealers.map((g) => (
            <div key={g.region} className="rounded-2xl bg-wine-dark p-5 text-cream">
              <div className="flex items-center justify-between">
                <h3 className="inline-flex items-center gap-2 text-[16px] font-medium">
                  <Building2 size={16} className="text-gold" /> {g.region}
                </h3>
                <span className="text-[12px] text-cream/70">{g.count} 个服务点</span>
              </div>
            </div>
          ))}
        </div>

        {/* 右：地图 + 列表卡 */}
        <div className="lg:col-span-2 space-y-5">
          {/* 简化美国地图占位 */}
          <div className="card-gold relative overflow-hidden">
            <div className="aspect-[16/8] bg-cream2">
              <svg viewBox="0 0 800 400" className="h-full w-full">
                <defs>
                  <linearGradient id="usbg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f5ead8" />
                    <stop offset="100%" stopColor="#d8c79a" />
                  </linearGradient>
                </defs>
                <rect width="800" height="400" fill="url(#usbg)" />
                {/* 简化美国轮廓 */}
                <path
                  d="M80 130 L160 90 L260 100 L380 80 L520 100 L640 110 L720 150 L730 220 L680 280 L580 320 L420 340 L300 320 L180 290 L100 240 Z"
                  fill="#fff"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                />
                {/* 标记点 */}
                {[
                  { x: 150, y: 220, label: 'LA' },
                  { x: 660, y: 160, label: 'NY' },
                  { x: 380, y: 280, label: 'HOU' },
                ].map((m) => (
                  <g key={m.label} transform={`translate(${m.x} ${m.y})`}>
                    <circle r="14" fill="#9B7EBD" />
                    <text
                      y="4"
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {m.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* 经销商详细卡片 */}
          {dealers.flatMap((g) =>
            g.items.map((it) => (
              <div key={it.name} className="card-gold p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
                        it.official ? 'bg-wine text-gold' : 'bg-gold/20 text-wine'
                      }`}
                    >
                      {it.official ? <Warehouse size={18} /> : <Building2 size={18} />}
                    </div>
                    <div>
                      <span className="rounded-md bg-cream2 px-2 py-0.5 text-[11px] text-wine-dark/80">
                        {it.type}
                      </span>
                      <h3 className="mt-1 font-serif text-[18px] font-medium text-wine-dark">
                        {it.name}
                      </h3>
                      <p className="mt-1 text-[13px] text-wine-dark/70">{it.address}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-wine-dark/70">
                        <span className="inline-flex items-center gap-1">
                          <Phone size={12} /> {it.phone}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} /> {it.hours}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-[12px] text-wine">
                    {it.stock}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 成为经销商 CTA */}
      <section className="mx-auto mt-16 max-w-[1280px] px-8">
        <div className="rounded-2xl border border-gold/40 bg-gradient-to-r from-cream2 to-cream p-10 text-center shadow-card">
          <h2 className="font-serif text-[32px] font-medium text-wine-dark">
            成为 Luundy 授权经销商
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] text-wine-dark/75">
            我们正在全美范围内寻找优质的家居家电合作伙伴。提供具有竞争力的代理价、市场支持与培训资源。
          </p>
          <button className="btn-wine mt-6">立即申请合作</button>
        </div>
      </section>
    </main>
  );
}

function Chip({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={`rounded-md px-3 py-1.5 text-[12px] ${
        active ? 'bg-wine text-cream' : 'border border-gold/40 text-wine-dark/85'
      }`}
    >
      {label}
    </button>
  );
}
