'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码至少需要6个字符');
      return;
    }

    setLoading(true);

    const { error } = await signUp(formData.email, formData.password, formData.displayName);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen diamond-bg flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="bg-cream rounded-2xl border border-gold/40 shadow-xl p-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-medium text-wine-dark mb-2">
              注册成功！
            </h2>
            <p className="text-wine-dark/60 text-sm mb-6">
              您的账户已创建成功，现在可以登录并使用了。
            </p>
            <Link href="/login" className="btn-wine inline-flex items-center gap-2">
              返回登录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen diamond-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-wine">
            <ShoppingBag size={32} />
            <span className="font-serif text-2xl font-medium">ZHONGQUE</span>
          </Link>
        </div>

        {/* Register Card */}
        <div className="bg-cream rounded-2xl border border-gold/40 shadow-xl p-8">
          <h1 className="font-serif text-2xl font-medium text-wine-dark text-center mb-2">
            创建账户
          </h1>
          <p className="text-wine-dark/60 text-center text-sm mb-8">
            加入 ZHONGQUE，享受专属优惠和服务
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-wine-dark mb-2">
                显示名称
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="您希望我们怎么称呼您"
                className="w-full px-4 py-3 rounded-lg border border-gold/40 bg-white text-wine-dark placeholder:text-wine-dark/40 focus:outline-none focus:border-wine focus:ring-1 focus:ring-wine"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-wine-dark mb-2">
                电子邮箱 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-gold/40 bg-white text-wine-dark placeholder:text-wine-dark/40 focus:outline-none focus:border-wine focus:ring-1 focus:ring-wine"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-wine-dark mb-2">
                密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="至少6个字符"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gold/40 bg-white text-wine-dark placeholder:text-wine-dark/40 focus:outline-none focus:border-wine focus:ring-1 focus:ring-wine"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-wine-dark/50 hover:text-wine"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-wine-dark mb-2">
                确认密码 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="再次输入密码"
                required
                className="w-full px-4 py-3 rounded-lg border border-gold/40 bg-white text-wine-dark placeholder:text-wine-dark/40 focus:outline-none focus:border-wine focus:ring-1 focus:ring-wine"
              />
            </div>

            <div className="text-sm">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-0.5 rounded border-gold/40 text-wine focus:ring-wine"
                />
                <span className="text-wine-dark">
                  我已阅读并同意 <Link href="/terms" className="text-wine hover:underline">服务条款</Link> 
                  和 <Link href="/privacy" className="text-wine hover:underline">隐私政策</Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-wine w-full justify-center py-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  注册中...
                </>
              ) : (
                '注册'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-wine-dark/60 text-sm">
              已有账户？{' '}
              <Link href="/login" className="text-wine hover:text-wine-dark font-medium">
                立即登录
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-wine-dark/60 hover:text-wine text-sm">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
