import { Tag } from 'lucide-react';

const coupons = [
  { tag: '全场通用', amount: 50, title: '重磅优惠', code: 'WELCOME50' },
  { tag: '仓库自提专用', amount: 150, title: '旋翼机自提优惠', code: 'PICKUP150' },
  { tag: '仓库自提专用', amount: 100, title: '四口机自提优惠', code: 'PICKUP100' },
];

export default function Coupons() {
  return (
    <section className="diamond-bg py-20">
      <div className="mx-auto max-w-[1280px] px-8 text-center">
        <span className="pill-decor">尊享礼遇</span>
        <h2 className="mt-6 font-serif text-[40px] font-medium text-wine-dark">
          新客专属，限时优惠
        </h2>
        <p className="mt-3 text-[15px] text-wine-dark/70">
          下单时输入优惠码，立享专属折扣
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div key={c.code} className="card-gold relative overflow-hidden pt-12 pb-6 px-6">
              {/* 顶部金色徽章 */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 flex h-14 w-20 items-center justify-center rounded-b-[28px] bg-gradient-to-b from-gold to-gold-light shadow-[0_4px_12px_rgba(212,175,55,0.4)]">
                <Tag className="text-wine-deeper" size={22} />
              </div>

              <p className="text-[13px] text-wine-dark/70">{c.tag}</p>

              <div className="mt-4 flex items-end justify-center gap-2">
                <span className="font-serif text-[52px] font-medium text-wine">
                  ${c.amount}
                </span>
                <span className="mb-3 text-[14px] text-wine-dark/70">立减</span>
              </div>

              <p className="mt-2 text-[16px] font-medium text-wine-dark">{c.title}</p>

              <div className="my-5 border-t border-dashed border-gold/40" />

              <p className="text-[13px] text-wine-dark/60">优惠码</p>
              <div className="mt-2 rounded-md bg-cream2 py-3 text-[16px] font-medium tracking-[2px] text-wine-dark">
                {c.code}
              </div>

              <button className="btn-wine mt-4 w-full justify-center !py-3">
                点击领取
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
