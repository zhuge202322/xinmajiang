import Link from 'next/link';
import { MessageSquare, Phone, Mail, Clock } from 'lucide-react';

const cols = [
  {
    title: '产品与个人',
    links: [
      { label: '折叠款四口机', href: '/product-category/folding-4mouth' },
      { label: '折叠款旋翼机', href: '/product-category/folding-rotary' },
      { label: '餐桌款四口机', href: '/product-category/table-4mouth' },
      { label: '餐桌款旋翼机', href: '/product-category/table-rotary' },
      { label: '户外麻将机', href: '/product-category/outdoor' },
      { label: '个人中心', href: '#' },
    ],
  },
  {
    title: '服务政策',
    links: [
      { label: '退换货政策', href: '/policy/refund' },
      { label: '质保条款', href: '/policy/warranty' },
      { label: '配送说明', href: '/policy/shipping' },
      { label: '隐私政策', href: '/policy/privacy' },
    ],
  },
  {
    title: '商务合作',
    links: [
      { label: '成为经销商', href: '/dealer-locator' },
      { label: '关于我们', href: '/about' },
      { label: '订单追踪', href: '/order-tracking' },
      { label: '博客', href: '/blog' },
    ],
  },
];

const contacts = [
  { icon: MessageSquare, text: '微信: az134mj' },
  { icon: Phone, text: '+1 (669) 721-9311' },
  { icon: Mail, text: 'houchang110505@gmail.com' },
  { icon: Clock, text: '周一至周日 9:00-18:00' },
];

const payments = ['Visa', 'Mastercard', '微信', '支付宝', 'Stripe', 'PayPal'];

export default function Footer() {
  return (
    <footer className="bg-wine-deeper text-cream">
      <div className="mx-auto max-w-[1280px] px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <img src="/img/logo.png" alt="ZHONGQUE" className="h-10" />
            <p className="mt-3 max-w-xs text-[13px] text-cream/70">
              专为海外华人打造的高端麻将机品牌，传承经典，创新体验。
            </p>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-[15px] font-medium text-gold-light">{c.title}</h4>
              <ul className="mt-4 space-y-2 text-[13px] text-cream/75">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-gold">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-[15px] font-medium text-gold-light">联系我们</h4>
            <ul className="mt-4 space-y-3 text-[13px] text-cream/75">
              {contacts.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2">
                  <Icon size={14} className="mt-0.5 text-gold" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gold/20 pt-8 text-center">
          <p className="text-[13px] text-cream/60">支持的支付方式</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-5">
            {payments.map((p) => (
              <span
                key={p}
                className="rounded-md border border-gold/30 bg-cream/5 px-3 py-2 text-[12px] text-cream/85"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-[12px] text-cream/55">
          © 2026 ZHONGQUE. All rights reserved. | 专为海外华人打造的高端麻将机品牌
        </p>
      </div>
    </footer>
  );
}
