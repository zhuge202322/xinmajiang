'use client';

import { useState } from 'react';
import { Save, Building, CreditCard, Bell, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'general', label: '通用设置', icon: Building },
    { id: 'payments', label: '支付设置', icon: CreditCard },
    { id: 'notifications', label: '通知设置', icon: Bell },
    { id: 'security', label: '安全设置', icon: Shield },
  ];

  async function handleSave() {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
        <p className="text-gray-500">配置商店设置</p>
      </div>

      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">通用设置</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商店名称</label>
                <input
                  type="text"
                  defaultValue="中雀麻将"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">联系邮箱</label>
                <input
                  type="email"
                  defaultValue="support@zhongque.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                <input
                  type="tel"
                  defaultValue="+1 234 567 8900"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                <textarea
                  rows={3}
                  defaultValue="123 Main Street, City, State 12345"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">支付设置</h2>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CreditCard size={20} />
                  <span className="font-medium">Stripe 已连接</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  您的 Stripe 账户已连接，可以接受支付。
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">货币</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="USD">USD - 美元</option>
                  <option value="EUR">EUR - 欧元</option>
                  <option value="GBP">GBP - 英镑</option>
                  <option value="CNY">CNY - 人民币</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">税率 (%)</label>
                <input
                  type="number"
                  defaultValue="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">通知设置</h2>
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                  <span>新订单邮件通知</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                  <span>支付成功邮件通知</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                  <span>库存不足提醒</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">安全设置</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">管理员 API 密钥</label>
                <input
                  type="password"
                  placeholder="输入 API 密钥"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  用于 API 认证
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Webhook 密钥</label>
                <input
                  type="password"
                  placeholder="Stripe webhook 密钥"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  从 Stripe webhook 设置中获取
                </p>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? '保存中...' : '保存设置'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
