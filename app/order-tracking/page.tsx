import { Mail, Search, Package, Truck, CheckCircle2, Clock } from 'lucide-react';

const sample = [
  { stage: '订单已下单', date: '2026-01-08 14:22', done: true, icon: CheckCircle2 },
  { stage: '正在生产', date: '2026-01-12 09:00', done: true, icon: Package },
  { stage: '海运中', date: '2026-01-25 06:30', done: true, icon: Truck },
  { stage: '已抵达美国港口', date: '2026-02-18 10:00', done: true, icon: Package },
  { stage: '配送中', date: '预计 2026-02-22', done: false, icon: Truck },
  { stage: '已签收', date: '—', done: false, icon: CheckCircle2 },
];

export default function OrderTrackingPage() {
  return (
    <main className="diamond-bg py-16">
      <div className="mx-auto max-w-3xl px-8">
        {/* 标题 */}
        <div className="text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-md border border-gold bg-cream2">
            <Mail className="text-wine" size={22} />
          </div>
          <h1 className="mt-4 font-serif text-[40px] font-medium text-wine-dark">
            订单<span className="text-gold">追踪</span>
          </h1>
          <p className="mt-3 text-[14px] text-wine-dark/70">
            输入订单号直接查询，或输入邮箱查看所有订单
          </p>
        </div>

        {/* 红色查询卡 */}
        <div className="mt-10 rounded-2xl bg-wine-dark p-8 text-cream shadow-card">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-wine-deeper border border-gold/50">
              <span className="font-serif text-[22px] text-gold-light">L</span>
            </div>
            <h2 className="mt-4 font-serif text-[24px] font-medium tracking-widest text-gold-light">
              ORDER INQUIRY
            </h2>
            <p className="mt-1 text-[12px] text-cream/70">在线订单查询回执单</p>
          </div>

          {/* 表单 */}
          <div className="mt-6 rounded-lg bg-cream p-6 text-wine-dark">
            <div className="flex items-center justify-between border-b border-gold/40 pb-3">
              <span className="inline-flex items-center gap-2 text-[12px] text-wine-dark/70">
                <Mail size={14} className="text-gold" /> RECEIPT FORM
              </span>
              <span className="text-[12px] text-wine-dark/70">No. RF-2026</span>
            </div>
            <p className="mt-4 text-center font-serif text-[18px]">
              致 <span className="text-gold">Luundy</span> 客服中心
            </p>

            <div className="mt-4 rounded-md bg-cream2 p-3 text-[12px] text-wine-dark/75">
              <Clock size={12} className="mr-1 inline -translate-y-px text-gold" />
              输入订单号可直接查询订单详情，或输入邮箱查看该邮箱下的所有订单。
            </div>

            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="text-[12px] text-wine-dark/70">订单号 (推荐)</span>
                <input
                  placeholder="LU-2026-XXXXXX"
                  className="mt-1 w-full rounded-md border border-gold/40 bg-white px-3 py-2 text-[14px] focus:border-wine focus:outline-none"
                />
              </label>
              <div className="text-center text-[12px] text-wine-dark/50">— 或 —</div>
              <label className="block">
                <span className="text-[12px] text-wine-dark/70">注册邮箱</span>
                <input
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-md border border-gold/40 bg-white px-3 py-2 text-[14px] focus:border-wine focus:outline-none"
                />
              </label>
            </div>

            <button className="btn-wine mt-5 w-full justify-center">
              <Search size={16} /> 查询订单
            </button>
          </div>
        </div>

        {/* 示例时间线 */}
        <div className="mt-12">
          <h3 className="font-serif text-[22px] font-medium text-wine-dark">
            订单状态示例
          </h3>
          <div className="mt-6 rounded-2xl border border-gold/40 bg-white p-6 shadow-card">
            <ol className="space-y-5">
              {sample.map((s, i) => {
                const Icon = s.icon;
                return (
                  <li key={s.stage} className="flex items-start gap-4">
                    <div className="relative">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          s.done
                            ? 'bg-wine text-gold'
                            : 'border border-gold/40 bg-cream2 text-wine-dark/40'
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      {i < sample.length - 1 && (
                        <span
                          className={`absolute left-1/2 top-9 h-6 w-px -translate-x-1/2 ${
                            s.done ? 'bg-wine/40' : 'bg-gold/30'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p
                        className={`text-[14px] ${
                          s.done ? 'font-medium text-wine-dark' : 'text-wine-dark/55'
                        }`}
                      >
                        {s.stage}
                      </p>
                      <p className="text-[12px] text-wine-dark/55">{s.date}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
