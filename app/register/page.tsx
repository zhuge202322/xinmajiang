'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Check,
  Gift,
} from 'lucide-react';

function strength(pwd: string) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s; // 0-4
}

export default function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState('');
  const [agree, setAgree] = useState(false);

  const score = useMemo(() => strength(pwd), [pwd]);
  const tips = ['较弱', '一般', '良好', '强', '很强'];
  const colors = [
    'bg-wine-dark/30',
    'bg-wine',
    'bg-gold',
    'bg-emerald-600',
    'bg-emerald-700',
  ];

  return (
    <main className="diamond-bg min-h-[80vh] py-16">
      <div className="mx-auto max-w-[1100px] px-8">
        <div className="card-gold mx-auto grid grid-cols-1 overflow-hidden lg:grid-cols-2">
          {/* 左侧权益区 */}
          <div className="relative hidden bg-wine-dark p-10 text-cream lg:block">
            <div className="absolute inset-0 diamond-bg-dark opacity-90" />
            <div className="relative">
              <span className="font-serif text-[34px] font-medium tracking-wide text-gold-light">
                Luundy
              </span>
              <p className="mt-2 text-[13px] text-cream/70">
                成为 Luundy 会员 · Join the Family
              </p>

              <h2 className="mt-12 font-serif text-[30px] font-medium leading-snug">
                注册即送
                <br />
                <span className="text-gold-light">$50 新人优惠券</span>
              </h2>
              <p className="mt-4 text-[14px] text-cream/80 leading-relaxed">
                注册成为 Luundy 会员，立刻享受购机优惠与终身专属权益。
              </p>

              <ul className="mt-8 space-y-4 text-[14px] text-cream/85">
                {[
                  '$50 新人优惠券，下单即抵',
                  '每月会员日全场 95 折',
                  '消费 1:1 积分，可兑现金',
                  '专属客服 1 对 1 选型咨询',
                  '免费延长 1 年质保',
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <Check className="shrink-0 text-gold-light" size={20} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-black/20 px-4 py-2 text-[12px] text-gold-light">
                <Gift size={14} /> 限时活动 · 注册即抵 $50
              </div>
            </div>
          </div>

          {/* 右侧表单 */}
          <div className="bg-white p-8 sm:p-10">
            <h1 className="font-serif text-[28px] font-medium text-wine-dark">
              创建账户
            </h1>
            <p className="mt-1 text-[13px] text-wine-dark/60">
              Create your Luundy account
            </p>

            <form className="mt-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[13px] text-wine-dark/80">
                    姓
                  </label>
                  <div className="flex items-center rounded-md border border-gold/40 bg-cream2 px-3">
                    <User size={16} className="text-wine-dark/50" />
                    <input
                      type="text"
                      placeholder="张"
                      className="w-full bg-transparent px-2 py-2.5 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[13px] text-wine-dark/80">
                    名
                  </label>
                  <div className="flex items-center rounded-md border border-gold/40 bg-cream2 px-3">
                    <User size={16} className="text-wine-dark/50" />
                    <input
                      type="text"
                      placeholder="三"
                      className="w-full bg-transparent px-2 py-2.5 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[13px] text-wine-dark/80">
                  邮箱地址
                </label>
                <div className="flex items-center rounded-md border border-gold/40 bg-cream2 px-3">
                  <Mail size={16} className="text-wine-dark/50" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-transparent px-2 py-2.5 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[13px] text-wine-dark/80">
                  手机号码
                </label>
                <div className="flex items-center rounded-md border border-gold/40 bg-cream2 px-3">
                  <Phone size={16} className="text-wine-dark/50" />
                  <input
                    type="tel"
                    placeholder="+1 415-555-0188"
                    className="w-full bg-transparent px-2 py-2.5 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[13px] text-wine-dark/80">
                  设置密码
                </label>
                <div className="flex items-center rounded-md border border-gold/40 bg-cream2 px-3">
                  <Lock size={16} className="text-wine-dark/50" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder="至少 8 位，包含大小写与数字"
                    className="w-full bg-transparent px-2 py-2.5 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="text-wine-dark/50 hover:text-wine"
                    aria-label="toggle password"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* 强度条 */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`h-1 flex-1 rounded ${
                          i < score ? colors[score] : 'bg-gold/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[12px] text-wine-dark/60">
                    {pwd ? tips[score] : '密码强度'}
                  </span>
                </div>
              </div>

              <label className="flex items-start gap-2 text-[13px] text-wine-dark/80">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-wine"
                />
                <span>
                  我已阅读并同意 Luundy 的{' '}
                  <Link href="/policy/privacy" className="text-wine hover:text-gold">
                    隐私政策
                  </Link>{' '}
                  与{' '}
                  <Link href="/policy/refund" className="text-wine hover:text-gold">
                    服务条款
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={!agree}
                className={`btn-wine w-full justify-center ${
                  !agree ? 'cursor-not-allowed opacity-50 hover:!shadow-none' : ''
                }`}
              >
                创建账户 <ArrowRight size={16} />
              </button>
            </form>

            <p className="mt-8 text-center text-[13px] text-wine-dark/70">
              已有账户？{' '}
              <Link href="/login" className="text-wine hover:text-gold">
                直接登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
