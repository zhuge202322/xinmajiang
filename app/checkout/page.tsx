import Link from 'next/link';
import { Check } from 'lucide-react';

const steps = [
  { num: 1, label: '联系信息' },
  { num: 2, label: '收货地址' },
  { num: 3, label: '运输方式' },
  { num: 4, label: '支付方式' },
];

const payments = ['信用卡 (Visa / Mastercard)', 'PayPal', 'Stripe', '微信支付', '支付宝', 'USDC'];

export default function CheckoutPage() {
  return (
    <main className="diamond-bg py-16">
      <div className="mx-auto max-w-[1280px] px-8">
        <h1 className="text-center font-serif text-[36px] font-medium text-wine-dark">
          结算 · Checkout
        </h1>

        {/* 进度条 */}
        <div className="mx-auto mt-8 flex max-w-2xl items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.num} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-medium ${
                    i === 0 ? 'bg-wine text-cream' : 'bg-cream2 text-wine-dark/60'
                  }`}
                >
                  {s.num}
                </div>
                <p className="mt-1 text-[12px] text-wine-dark/70">{s.label}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="mx-2 h-px flex-1 bg-gold/40" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 表单 */}
          <div className="lg:col-span-2 space-y-6">
            <section className="card-gold p-6">
              <h2 className="font-serif text-[20px] font-medium text-wine-dark">
                1. 联系信息
              </h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="姓名" placeholder="张三" />
                <Field label="电话" placeholder="+1 555 123 4567" />
                <Field label="邮箱" placeholder="you@example.com" full />
              </div>
            </section>

            <section className="card-gold p-6">
              <h2 className="font-serif text-[20px] font-medium text-wine-dark">
                2. 收货地址
              </h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="街道地址" placeholder="123 Main St" full />
                <Field label="城市" placeholder="Los Angeles" />
                <Field label="州" placeholder="CA" />
                <Field label="邮编" placeholder="90001" />
                <Field label="国家" placeholder="United States" />
              </div>
            </section>

            <section className="card-gold p-6">
              <h2 className="font-serif text-[20px] font-medium text-wine-dark">
                3. 运输方式
              </h2>
              <div className="mt-4 space-y-3">
                <Radio
                  title="海运直达（30–45 天）"
                  desc="全美 48 州免费配送，含送货上门"
                  price="免费"
                  checked
                />
                <Radio
                  title="Fedex 派送（3–7 天）"
                  desc="从美国仓库 Fedex 快递发货"
                  price="$250"
                />
                <Radio
                  title="仓库自提"
                  desc="洛杉矶 / 纽约仓库就近自取"
                  price="免费"
                />
              </div>
            </section>

            <section className="card-gold p-6">
              <h2 className="font-serif text-[20px] font-medium text-wine-dark">
                4. 支付方式
              </h2>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {payments.map((p, i) => (
                  <label
                    key={p}
                    className={`flex items-center gap-2 rounded-md border px-3 py-3 text-[13px] cursor-pointer ${
                      i === 0
                        ? 'border-wine bg-cream2'
                        : 'border-gold/40 hover:border-wine'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      defaultChecked={i === 0}
                      className="accent-wine"
                    />
                    {p}
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* 摘要 */}
          <aside className="card-gold h-max p-6">
            <h2 className="font-serif text-[20px] font-medium text-wine-dark">
              订单摘要
            </h2>
            <div className="mt-4 space-y-3 text-[14px] text-wine-dark/85">
              <div className="flex justify-between">
                <span>乐万家折叠麻将机 × 1</span>
                <span>$599</span>
              </div>
              <div className="flex justify-between">
                <span>静雅餐桌旋翼机 × 1</span>
                <span>$699</span>
              </div>
            </div>
            <div className="my-4 border-t border-gold/30" />
            <div className="flex justify-between text-[14px]">
              <span>商品小计</span>
              <span>$1,298</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span>运费</span>
              <span className="text-gold">免费</span>
            </div>
            <div className="flex justify-between text-[14px] text-wine">
              <span>新客优惠 (WELCOME50)</span>
              <span>−$50</span>
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-gold/30 pt-4">
              <span className="text-[14px] text-wine-dark/70">合计</span>
              <span className="font-serif text-[28px] font-medium text-wine">$1,248</span>
            </div>
            <button className="btn-wine mt-6 w-full justify-center">
              <Check size={16} /> 提交订单
            </button>
            <Link
              href="/cart"
              className="mt-3 block text-center text-[13px] text-wine-dark/70 hover:text-wine"
            >
              返回购物车
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  placeholder,
  full,
}: {
  label: string;
  placeholder: string;
  full?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1 ${full ? 'md:col-span-2' : ''}`}>
      <span className="text-[12px] text-wine-dark/70">{label}</span>
      <input
        placeholder={placeholder}
        className="rounded-md border border-gold/40 bg-cream2 px-3 py-2 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:border-wine focus:outline-none"
      />
    </label>
  );
}

function Radio({
  title,
  desc,
  price,
  checked,
}: {
  title: string;
  desc: string;
  price: string;
  checked?: boolean;
}) {
  return (
    <label
      className={`flex items-start justify-between gap-4 rounded-md border p-4 cursor-pointer ${
        checked ? 'border-wine bg-cream2' : 'border-gold/40 hover:border-wine'
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="radio"
          name="ship"
          defaultChecked={checked}
          className="mt-1 accent-wine"
        />
        <div>
          <p className="text-[14px] font-medium text-wine-dark">{title}</p>
          <p className="text-[12px] text-wine-dark/70">{desc}</p>
        </div>
      </div>
      <span className="text-[14px] text-wine">{price}</span>
    </label>
  );
}
