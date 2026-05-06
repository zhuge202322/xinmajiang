'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Copy,
  Phone
} from 'lucide-react';

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingMethod: string;
  items: any[];
  createdAt: string;
};

const statusTimeline: Record<string, { icon: any; label: string; description: string }[]> = {
  pending: [
    { icon: Clock, label: '订单已下单', description: '我们已收到您的订单' },
  ],
  confirmed: [
    { icon: CheckCircle2, label: '订单已确认', description: '订单确认成功，准备处理' },
    { icon: Clock, label: '等待处理', description: '您的订单等待处理中' },
  ],
  processing: [
    { icon: CheckCircle2, label: '订单已确认', description: '订单确认成功' },
    { icon: Package, label: '正在生产/备货', description: '您的商品正在准备中' },
    { icon: Clock, label: '等待发货', description: '等待安排发货' },
  ],
  shipped: [
    { icon: CheckCircle2, label: '订单已确认', description: '订单确认成功' },
    { icon: Package, label: '已备货', description: '商品已准备完毕' },
    { icon: Truck, label: '已发货', description: '商品已发出，正在运输中' },
    { icon: Clock, label: '等待到达', description: '运输途中' },
  ],
  delivered: [
    { icon: CheckCircle2, label: '订单已确认', description: '订单确认成功' },
    { icon: Package, label: '已备货', description: '商品已准备完毕' },
    { icon: Truck, label: '已发货', description: '商品已发出' },
    { icon: Package, label: '已到达', description: '商品已到达目的地' },
    { icon: CheckCircle2, label: '已签收', description: '感谢您的购买！' },
  ],
  cancelled: [
    { icon: CheckCircle2, label: '订单已取消', description: '订单已被取消' },
  ],
  refunded: [
    { icon: CheckCircle2, label: '已退款', description: '款项已退回' },
  ],
};

export default function OrderTrackingPage() {
  const [searchType, setSearchType] = useState<'orderNumber' | 'email'>('orderNumber');
  const [searchValue, setSearchValue] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError('请输入查询信息');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      let res;
      if (searchType === 'orderNumber') {
        res = await fetch(`/api/orders/lookup?orderNumber=${encodeURIComponent(searchValue)}`);
      } else {
        res = await fetch(`/api/orders/lookup?email=${encodeURIComponent(searchValue)}`);
      }

      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        setOrders([]);
      } else {
        setOrders(data.orders || []);
        if (!data.orders || data.orders.length === 0) {
          setError('未找到相关订单');
        }
      }
    } catch (err) {
      setError('查询失败，请稍后重试');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const copyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-600',
      confirmed: 'text-blue-600',
      processing: 'text-purple-600',
      shipped: 'text-indigo-600',
      delivered: 'text-green-600',
      cancelled: 'text-red-600',
      refunded: 'text-gray-600',
    };
    return colors[status] || 'text-gray-600';
  };

  const getPaymentColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <main className="diamond-bg py-16">
      <div className="mx-auto max-w-3xl px-8">
        {/* Header */}
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

        {/* Search Card */}
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

          {/* Form */}
          <div className="mt-6 rounded-lg bg-cream p-6 text-wine-dark">
            <div className="flex items-center justify-between border-b border-gold/40 pb-3">
              <span className="inline-flex items-center gap-2 text-[12px] text-wine-dark/70">
                <Mail size={14} className="text-gold" /> RECEIPT FORM
              </span>
              <span className="text-[12px] text-wine-dark/70">ZHONGQUE</span>
            </div>
            <p className="mt-4 text-center font-serif text-[18px]">
              致 <span className="text-gold">ZHONGQUE</span> 客服中心
            </p>

            <div className="mt-4 rounded-md bg-cream2 p-3 text-[12px] text-wine-dark/75">
              <Clock size={12} className="mr-1 inline -translate-y-px text-gold" />
              输入订单号可直接查询订单详情，或输入邮箱查看该邮箱下的所有订单。
            </div>

            {/* Search Type Toggle */}
            <div className="mt-5 flex rounded-lg bg-gray-200 p-1">
              <button
                onClick={() => setSearchType('orderNumber')}
                className={`flex-1 rounded-md py-2 text-[13px] font-medium transition-colors ${
                  searchType === 'orderNumber'
                    ? 'bg-white text-wine-dark shadow-sm'
                    : 'text-wine-dark/60'
                }`}
              >
                订单号查询
              </button>
              <button
                onClick={() => setSearchType('email')}
                className={`flex-1 rounded-md py-2 text-[13px] font-medium transition-colors ${
                  searchType === 'email'
                    ? 'bg-white text-wine-dark shadow-sm'
                    : 'text-wine-dark/60'
                }`}
              >
                邮箱查询
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {searchType === 'orderNumber' ? (
                <label className="block">
                  <span className="text-[12px] text-wine-dark/70">订单号</span>
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="LUY-2026-XXXXXX"
                    className="mt-1 w-full rounded-md border border-gold/40 bg-white px-3 py-2 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:border-wine focus:outline-none"
                  />
                </label>
              ) : (
                <label className="block">
                  <span className="text-[12px] text-wine-dark/70">注册邮箱</span>
                  <input
                    type="email"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded-md border border-gold/40 bg-white px-3 py-2 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:border-wine focus:outline-none"
                  />
                </label>
              )}
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-red-100 p-3 text-[13px] text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn-wine mt-5 w-full justify-center disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  查询中...
                </span>
              ) : (
                <>
                  <Search size={16} /> 查询订单
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searched && orders.length > 0 && (
          <div className="mt-12 space-y-6">
            {orders.map((order) => {
              const timeline = statusTimeline[order.status] || statusTimeline.pending;
              return (
                <div key={order.id} className="rounded-2xl border border-gold/40 bg-white p-6 shadow-card">
                  {/* Order Header */}
                  <div className="flex items-start justify-between border-b border-gold/30 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-[20px] text-wine-dark">
                          {order.orderNumber}
                        </h3>
                        <button
                          onClick={() => copyOrderNumber(order.orderNumber)}
                          className="text-wine-dark/40 hover:text-wine"
                          title="复制订单号"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                      <p className="mt-1 text-[12px] text-wine-dark/60">
                        {new Date(order.createdAt).toLocaleString('zh-CN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getPaymentColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                      <p className="mt-1 font-serif text-[20px] text-wine">
                        ${order.total?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-4 space-y-2">
                    {order.items?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-[14px]">
                        <span className="text-wine-dark">{item.name || item.productName} x{item.quantity || 1}</span>
                        <span className="text-wine-dark/70">${(item.price || 0) * (item.quantity || 1)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Timeline */}
                  <div className="mt-6">
                    <h4 className="text-[14px] font-medium text-wine-dark mb-4">订单状态</h4>
                    <ol className="space-y-5">
                      {timeline.map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <li key={i} className="flex items-start gap-4">
                            <div className="relative">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-wine text-gold">
                                <Icon size={16} />
                              </div>
                              {i < timeline.length - 1 && (
                                <span className="absolute left-1/2 top-9 h-6 w-px -translate-x-1/2 bg-wine/40" />
                              )}
                            </div>
                            <div className="flex-1 pt-1">
                              <p className="font-medium text-wine-dark">{item.label}</p>
                              <p className="text-[12px] text-wine-dark/60">{item.description}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <Link
                      href={`/order-tracking/${order.orderNumber}`}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-wine px-4 py-2 text-[14px] text-cream hover:bg-wine/90 transition-colors"
                    >
                      查看详情 <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        {!searched && (
          <div className="mt-12">
            <h3 className="font-serif text-[22px] font-medium text-wine-dark">
              查询帮助
            </h3>
            <div className="mt-6 rounded-2xl border border-gold/40 bg-white p-6 shadow-card space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wine text-gold">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-medium text-wine-dark">通过邮件查询</p>
                  <p className="mt-1 text-[13px] text-wine-dark/70">
                    发送邮件至 support@zhongque.com，附上您的订单信息
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wine text-gold">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="font-medium text-wine-dark">电话咨询</p>
                  <p className="mt-1 text-[13px] text-wine-dark/70">
                    拨打客服热线 +1 (234) 567-890
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
