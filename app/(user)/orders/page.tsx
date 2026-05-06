'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  ChevronRight,
  Clock,
  Check,
  Truck,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  items: any[];
  productSlug: string;
  productName: string;
  configuration: Record<string, string>;
  finalPrice: number;
  createdAt: string;
  updatedAt: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: '待处理', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: Clock },
  confirmed: { label: '已确认', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Check },
  processing: { label: '处理中', color: 'text-purple-600 bg-purple-50 border-purple-200', icon: Package },
  shipped: { label: '已发货', color: 'text-indigo-600 bg-indigo-50 border-indigo-200', icon: Truck },
  delivered: { label: '已完成', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: Check },
  cancelled: { label: '已取消', color: 'text-red-600 bg-red-50 border-red-200', icon: Clock },
  refunded: { label: '已退款', color: 'text-gray-600 bg-gray-50 border-gray-200', icon: Clock },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Skip redirect during initial auth check
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || '获取订单失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (authLoading || loading) {
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
      <div className="mx-auto max-w-[900px] px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1 text-wine-dark/60 hover:text-wine text-sm mb-2"
            >
              <ArrowLeft size={14} />
              返回个人中心
            </Link>
            <h1 className="font-serif text-3xl font-medium text-cream">
              我的订单
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
            <button
              onClick={fetchOrders}
              className="ml-4 underline hover:no-underline"
            >
              重试
            </button>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-cream rounded-2xl border border-gold/40 p-12 text-center">
            <Package size={48} className="mx-auto text-wine-dark/30 mb-4" />
            <h3 className="font-serif text-xl font-medium text-wine-dark mb-2">
              暂无订单
            </h3>
            <p className="text-wine-dark/60 mb-6">
              您还没有任何订单，快去选购心仪的麻将机吧！
            </p>
            <Link href="/shop" className="btn-wine inline-flex">
              浏览商品
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="bg-cream rounded-2xl border border-gold/40 overflow-hidden hover:border-wine/50 transition"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gold/30 bg-wine/5">
                    <div className="flex items-center gap-4">
                      <span className="text-wine-dark/60 text-sm">
                        订单号：{order.orderNumber}
                      </span>
                      <span className="text-wine-dark/40">|</span>
                      <span className="text-wine-dark/60 text-sm">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
                    >
                      <StatusIcon size={12} />
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Product Image Placeholder */}
                      <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-cream2 to-cream overflow-hidden shrink-0">
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={32} className="text-wine/30" />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <Link
                          href={`/product/${order.productSlug}`}
                          className="font-serif text-lg font-medium text-wine-dark hover:text-wine transition"
                        >
                          {order.productName || '麻将机'}
                        </Link>
                        <div className="mt-2 text-wine-dark/60 text-sm">
                          {order.configuration && Object.keys(order.configuration).length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(order.configuration)
                                .filter(([key, value]) => value && key !== 'productName')
                                .map(([key, value]) => (
                                  <span
                                    key={key}
                                    className="inline-block px-2 py-0.5 rounded bg-gold-soft/50 text-wine-dark/80 text-xs"
                                  >
                                    {String(value)}
                                  </span>
                                ))}
                            </div>
                          ) : (
                            <span>标准配置</span>
                          )}
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="text-right">
                        <div className="font-serif text-2xl font-medium text-wine">
                          ${order.finalPrice || order.total}
                        </div>
                        <Link
                          href={`/order-tracking?order=${order.orderNumber}`}
                          className="inline-flex items-center gap-1 mt-2 text-wine hover:text-wine-dark text-sm"
                        >
                          查看详情
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    {order.shippingStreet && (
                      <div className="mt-4 pt-4 border-t border-gold/20 text-sm text-wine-dark/60">
                        <span className="text-wine-dark/50">收货地址：</span>
                        {[order.shippingCity, order.shippingState, order.shippingStreet]
                          .filter(Boolean)
                          .join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
