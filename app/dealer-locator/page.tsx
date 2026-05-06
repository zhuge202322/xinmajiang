'use client';
import { Search, MapPin, Building2, Warehouse, Phone, Clock, MessageCircle, Mail } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

type MapLocation = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  isOfficial?: boolean;
  type: string;
};

const dealers = [
  {
    region: '美国',
    count: 7,
    items: [
      {
        type: '仓库',
        name: '纽约布鲁克林',
        address: '17 County loop, Staten Island, NY',
        phone: '+1 (669) 721-9311',
        wechat: 'az134mj',
        email: 'houchang110505@gmail.com',
        hours: '周一至周日 9:00–18:00',
        stock: '库存充足',
        official: true,
        lat: 40.5795,
        lng: -74.1502,
      },
      {
        type: '经销商',
        name: '纽约法拉盛',
        address: 'Kissena Blvd, Flushing, NY 11367',
        phone: '+1 (669) 721-9311',
        wechat: 'az134mj',
        email: 'houchang110505@gmail.com',
        hours: '周一至周日 10:00–19:00',
        stock: '库存充足',
        official: false,
        lat: 40.7282,
        lng: -73.7949,
      },
      {
        type: '经销商',
        name: '洛杉矶经销商',
        address: '13963 Amar Rd, La Puente, CA 91746',
        phone: '+1 (669) 721-9311',
        wechat: 'az134mj',
        email: 'houchang110505@gmail.com',
        hours: '周一至周日 10:00–19:00',
        stock: '可订货',
        official: false,
        lat: 34.0276,
        lng: -117.9511,
      },
      {
        type: '仓库',
        name: '新泽西仓库',
        address: '45 Fernwood Ave, Suite D, Edison, NJ 08837',
        phone: '+1 (669) 721-9311',
        wechat: 'az134mj',
        email: 'houchang110505@gmail.com',
        hours: '周一至周日 9:00–18:00',
        stock: '库存充足',
        official: true,
        lat: 40.5187,
        lng: -74.4121,
      },
      {
        type: '仓库',
        name: '洛杉矶仓库',
        address: '2440 S. Milliken Avenue, Ontario, CA 91761',
        phone: '+1 (669) 721-9311',
        wechat: 'az134mj',
        email: 'houchang110505@gmail.com',
        hours: '周一至周日 9:00–18:00',
        stock: '库存充足',
        official: true,
        lat: 34.0125,
        lng: -117.5927,
      },
      {
        type: '仓库',
        name: '奥克兰仓库',
        address: '1997 Davis St, San Leandro, CA 94577',
        phone: '+1 (669) 721-9311',
        wechat: 'az134mj',
        email: 'houchang110505@gmail.com',
        hours: '周一至周日 9:00–18:00',
        stock: '库存充足',
        official: true,
        lat: 37.7254,
        lng: -122.1604,
      },
      {
        type: '经销商',
        name: '休斯顿',
        address: '5615 W Fuqua St Unit C-100, Houston, TX 77085',
        phone: '+1 (669) 721-9311',
        wechat: 'az134mj',
        email: 'houchang110505@gmail.com',
        hours: '周一至周日 10:00–19:00',
        stock: '可订货',
        official: false,
        lat: 29.6126,
        lng: -95.4769,
      },
    ],
  },
  {
    region: '澳洲',
    count: 3,
    items: [
      {
        type: '经销商',
        name: '悉尼',
        address: '8/40 Brodie St Rydalmer NSW 2116 AU',
        phone: '+1 (669) 721-9311',
        wechat: 'az134mj',
        email: 'houchang110505@gmail.com',
        hours: '周一至周六 10:00–18:00',
        stock: '可订货',
        official: false,
        lat: -33.8688,
        lng: 151.2093,
      },
      {
        type: '经销商',
        name: '墨尔本',
        address: 'Building J, 413 Francis St Brooklyn VIC 3012',
        phone: '+1 (669) 721-9311',
        wechat: 'az134mj',
        email: 'houchang110505@gmail.com',
        hours: '周一至周六 10:00–18:00',
        stock: '可订货',
        official: false,
        lat: -37.8136,
        lng: 144.9631,
      },
      {
        type: '经销商',
        name: '布里斯班',
        address: '51 Mangrave Rd Coopers Plains QLD AU',
        phone: '+1 (669) 721-9311',
        wechat: 'az134mj',
        email: 'houchang110505@gmail.com',
        hours: '周一至周六 10:00–18:00',
        stock: '可订货',
        official: false,
        lat: -27.4698,
        lng: 153.0251,
      },
    ],
  },
  {
    region: '加拿大',
    count: 1,
    items: [
      {
        type: '经销商',
        name: '多伦多',
        address: 'A2-350 Hunter\'s Valley Rd, Kleinburg, ON L4H 3N6',
        phone: '+1 (669) 721-9311',
        wechat: 'az134mj',
        email: 'houchang110505@gmail.com',
        hours: '周一至周日 10:00–18:00',
        stock: '可订货',
        official: false,
        lat: 43.8561,
        lng: -79.5183,
      },
    ],
  },
];

const allLocations: MapLocation[] = dealers.flatMap((g) =>
  g.items.map((it) => ({
    name: it.name,
    address: it.address,
    lat: it.lat,
    lng: it.lng,
    isOfficial: it.official,
    type: it.type,
  }))
);

export default function DealerLocatorPage() {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  return (
    <main className="diamond-bg py-10">
      {/* 头部红卡 */}
      <section className="mx-auto max-w-[1280px] px-8">
        <div className="rounded-2xl bg-wine-dark p-10 text-cream">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-[40px] font-medium">
                寻找您身边的 <span className="text-gold-light">ZHONGQUE</span>
              </h1>
              <p className="mt-2 text-[14px] text-cream/80">
                查看全美授权经销商与自提仓库位置
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-wine-deeper px-4 py-2 text-[14px] text-gold-light">
              <MapPin size={16} /> 全球 11 个服务点
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
          {/* Google 地图 */}
          <div className="card-gold overflow-hidden p-4">
            <Map
              locations={allLocations}
              selectedLocation={selectedLocation}
              onMarkerClick={setSelectedLocation}
              height="380px"
            />
          </div>

          {/* 经销商详细卡片 */}
          {dealers.flatMap((g) =>
            g.items.map((it) => (
              <div
                key={it.name}
                className={`card-gold cursor-pointer p-5 transition-all ${
                  selectedLocation?.name === it.name
                    ? 'ring-2 ring-gold shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() =>
                  setSelectedLocation(
                    selectedLocation?.name === it.name
                      ? null
                      : {
                          name: it.name,
                          address: it.address,
                          lat: it.lat,
                          lng: it.lng,
                          isOfficial: it.official,
                          type: it.type,
                        }
                  )
                }
              >
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
                          <MessageCircle size={12} /> {it.wechat}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Mail size={12} /> {it.email}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-[12px] text-wine-dark/70">
                        <Clock size={12} /> {it.hours}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-[12px] text-wine">
                      {it.stock}
                    </span>
                    {selectedLocation?.name === it.name && (
                      <span className="rounded-full bg-wine px-3 py-1 text-[11px] text-gold">
                        地图定位中
                      </span>
                    )}
                  </div>
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
            成为 ZHONGQUE 授权经销商
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
