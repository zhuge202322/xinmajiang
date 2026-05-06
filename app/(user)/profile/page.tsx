'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  Loader2,
  Check,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut, updateProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'info' | 'settings'>('info');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
  });

  useEffect(() => {
    // Skip redirect during initial auth check
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const { error } = await updateProfile(formData);

    if (!error) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-wine" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen diamond-bg py-12">
      <div className="mx-auto max-w-[1000px] px-8">
        <h1 className="font-serif text-3xl font-medium text-cream text-center mb-8">
          个人中心
        </h1>

        <div className="grid grid-cols-[240px_1fr] gap-6">
          {/* Sidebar */}
          <div className="bg-cream rounded-2xl border border-gold/40 overflow-hidden">
            {/* User Info */}
            <div className="p-6 text-center border-b border-gold/30">
              <div className="w-20 h-20 rounded-full bg-wine/10 mx-auto mb-3 flex items-center justify-center">
                <User size={32} className="text-wine" />
              </div>
              <p className="font-medium text-wine-dark">
                {user.displayName || user.email.split('@')[0]}
              </p>
              <p className="text-wine-dark/60 text-sm">{user.email}</p>
              {user.isAdmin && (
                <span className="inline-block mt-2 px-2 py-0.5 rounded bg-wine/20 text-wine text-xs">
                  管理员
                </span>
              )}
            </div>

            {/* Navigation */}
            <nav className="p-2">
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                  activeTab === 'info'
                    ? 'bg-wine/10 text-wine'
                    : 'text-wine-dark hover:bg-wine/5'
                }`}
              >
                <User size={18} />
                <span>个人信息</span>
              </button>
              <Link
                href="/orders"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-wine-dark hover:bg-wine/5 transition"
              >
                <Package size={18} />
                <span>我的订单</span>
              </Link>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                  activeTab === 'settings'
                    ? 'bg-wine/10 text-wine'
                    : 'text-wine-dark hover:bg-wine/5'
                }`}
              >
                <Settings size={18} />
                <span>账户设置</span>
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={18} />
                <span>退出登录</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="bg-cream rounded-2xl border border-gold/40 p-6">
            {activeTab === 'info' && (
              <div>
                <h2 className="font-serif text-xl font-medium text-wine-dark mb-6">
                  个人信息
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-wine-dark mb-2">
                        显示名称
                      </label>
                      <input
                        type="text"
                        value={formData.displayName}
                        onChange={(e) =>
                          setFormData({ ...formData, displayName: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gold/40 bg-white text-wine-dark focus:outline-none focus:border-wine"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-wine-dark mb-2">
                        手机号码
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 rounded-lg border border-gold/40 bg-white text-wine-dark placeholder:text-wine-dark/40 focus:outline-none focus:border-wine"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-wine-dark mb-2">
                      电子邮箱
                    </label>
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full px-4 py-3 rounded-lg border border-gold/30 bg-gray-50 text-wine-dark/60 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-wine-dark/50">
                      邮箱地址不可更改
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-wine flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          保存中...
                        </>
                      ) : saveSuccess ? (
                        <>
                          <Check size={16} />
                          已保存
                        </>
                      ) : (
                        '保存修改'
                      )}
                    </button>
                  </div>
                </form>

                {/* Quick Links */}
                <div className="mt-8 pt-6 border-t border-gold/30">
                  <h3 className="font-medium text-wine-dark mb-4">快捷链接</h3>
                  <div className="space-y-2">
                    <Link
                      href="/orders"
                      className="flex items-center justify-between p-4 rounded-lg border border-gold/40 hover:border-wine hover:bg-wine/5 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Package size={18} className="text-wine" />
                        <span className="text-wine-dark">我的订单</span>
                      </div>
                      <ChevronRight size={16} className="text-wine-dark/50" />
                    </Link>
                    {user.isAdmin && (
                      <Link
                        href="/admin/products"
                        className="flex items-center justify-between p-4 rounded-lg border border-gold/40 hover:border-wine hover:bg-wine/5 transition"
                      >
                        <div className="flex items-center gap-3">
                          <Settings size={18} className="text-wine" />
                          <span className="text-wine-dark">产品管理</span>
                        </div>
                        <ChevronRight size={16} className="text-wine-dark/50" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="font-serif text-xl font-medium text-wine-dark mb-6">
                  账户设置
                </h2>

                <div className="space-y-6">
                  <div className="p-4 rounded-lg border border-gold/40">
                    <h3 className="font-medium text-wine-dark mb-2">修改密码</h3>
                    <p className="text-wine-dark/60 text-sm mb-4">
                      定期修改密码可以保护您的账户安全
                    </p>
                    <button className="btn-outline text-sm">
                      修改密码
                    </button>
                  </div>

                  <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                    <h3 className="font-medium text-red-700 mb-2">危险区域</h3>
                    <p className="text-red-600/80 text-sm mb-4">
                      删除账户后，所有数据将无法恢复
                    </p>
                    <button className="px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-100 text-sm">
                      删除账户
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
