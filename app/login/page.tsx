'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { signIn } = useAuth();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '';
  const denied = searchParams.get('denied') === '1';

  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    const { error: loginError } = await signIn(email, password);

    if (loginError) {
      setError(loginError);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      const target = nextPath && nextPath.startsWith('/') ? nextPath : '/profile';
      setTimeout(() => {
        window.location.href = target;
      }, 500);
    }
  };

  return (
    <main className="diamond-bg min-h-[80vh] py-16">
      <div className="mx-auto max-w-[1100px] px-8">
        <div className="card-gold mx-auto grid grid-cols-1 overflow-hidden lg:grid-cols-2">
          {/* 左侧品牌区 */}
          <div className="relative hidden bg-wine-dark p-10 text-cream lg:block">
            <div className="absolute inset-0 diamond-bg-dark opacity-90" />
            <div className="relative">
              <span className="font-serif text-[34px] font-medium tracking-wide text-gold-light">
                ZHONGQUE
              </span>
              <p className="mt-2 text-[13px] text-cream/70">
                Automatic Mahjong Table · 自动麻将机
              </p>

              <h2 className="mt-12 font-serif text-[30px] font-medium leading-snug">
                欢迎回到 ZHONGQUE
                <br />
                <span className="text-gold-light">Welcome Back</span>
              </h2>
              <p className="mt-4 text-[14px] text-cream/80 leading-relaxed">
                登录后可享受会员专属价、订单追踪、保修登记等多项权益。
              </p>

              <ul className="mt-10 space-y-4 text-[14px] text-cream/85">
                <li className="flex gap-3">
                  <ShieldCheck className="shrink-0 text-gold-light" size={20} />
                  <span>会员专享：每月会员日全场 95 折</span>
                </li>
                <li className="flex gap-3">
                  <ShieldCheck className="shrink-0 text-gold-light" size={20} />
                  <span>积分商城：消费返积分，可抵现金</span>
                </li>
                <li className="flex gap-3">
                  <ShieldCheck className="shrink-0 text-gold-light" size={20} />
                  <span>专属客服：1 对 1 售前选型与售后</span>
                </li>
              </ul>

              <p className="absolute bottom-0 left-0 mt-12 text-[12px] text-cream/50">
                © {new Date().getFullYear()} ZHONGQUE. All Rights Reserved.
              </p>
            </div>
          </div>

          {/* 右侧表单 */}
          <div className="bg-white p-8 sm:p-10">
            <h1 className="font-serif text-[28px] font-medium text-wine-dark">
              登录账户
            </h1>
            <p className="mt-1 text-[13px] text-wine-dark/60">
              Sign in to your ZHONGQUE account
            </p>

            {/* 需要管理员权限提示 */}
            {denied && (
              <div className="mt-6 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm flex items-start gap-2">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <span>
                  该页面仅限管理员访问，请使用管理员账户登录。
                </span>
              </div>
            )}

            {/* 需要登录提示 */}
            {!denied && nextPath && (
              <div className="mt-6 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm flex items-start gap-2">
                <Lock size={16} className="mt-0.5 shrink-0" />
                <span>请先登录后再访问 {nextPath}</span>
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className="mt-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* 成功提示 */}
            {success && (
              <div className="mt-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
                <CheckCircle size={16} />
                登录成功！正在跳转...
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-1 block text-[13px] text-wine-dark/80">
                  邮箱地址
                </label>
                <div className="flex items-center rounded-md border border-gold/40 bg-cream2 px-3">
                  <Mail size={16} className="text-wine-dark/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-transparent px-2 py-2.5 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 flex items-center justify-between text-[13px] text-wine-dark/80">
                  密码
                  <Link href="#" className="text-[12px] text-gold hover:text-wine">
                    忘记密码？
                  </Link>
                </label>
                <div className="flex items-center rounded-md border border-gold/40 bg-cream2 px-3">
                  <Lock size={16} className="text-wine-dark/50" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
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
              </div>

              <label className="flex items-center gap-2 text-[13px] text-wine-dark/80">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-wine"
                  defaultChecked
                />
                7 天内自动登录
              </label>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-wine w-full justify-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    登录中...
                  </>
                ) : (
                  <>登 录 <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* 分隔 */}
            <div className="my-6 flex items-center gap-3 text-[12px] text-wine-dark/50">
              <span className="h-px flex-1 bg-gold/40" />
              或使用第三方登录
              <span className="h-px flex-1 bg-gold/40" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {['微信', 'Google', 'Apple'].map((p) => (
                <button
                  key={p}
                  className="rounded-md border border-gold/40 bg-cream2 px-4 py-2.5 text-[13px] text-wine-dark hover:border-wine hover:text-wine"
                  disabled
                >
                  {p}
                </button>
              ))}
            </div>

            {/* 演示账号 */}
            <div className="mt-6 p-4 rounded-lg bg-gold-soft/30 border border-gold/30">
              <p className="text-wine-dark/70 text-xs text-center mb-2">演示账号</p>
              <p className="text-wine-dark/60 text-xs text-center">admin@zhontre.com.cn / admin123</p>
            </div>

            <p className="mt-8 text-center text-[13px] text-wine-dark/70">
              还没有账户？{' '}
              <Link href="/register" className="text-wine hover:text-gold">
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
