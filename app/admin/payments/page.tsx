'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  DollarSign,
  ExternalLink
} from 'lucide-react';

type Payment = {
  id: string;
  orderNumber: string;
  amount: number;
  status: string;
  method: string;
  provider: string;
  createdAt: string;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stripeConnected, setStripeConnected] = useState(false);

  useEffect(() => {
    fetchPayments();
    checkStripeConnection();
  }, []);

  async function fetchPayments() {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        // Extract payments from orders
        const allPayments = (data.orders || []).map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          amount: order.total || 0,
          status: order.paymentStatus,
          method: order.paymentMethod || 'stripe',
          provider: 'stripe',
          customerEmail: order.customerEmail,
          createdAt: order.createdAt,
        }));
        setPayments(allPayments);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function checkStripeConnection() {
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST', body: JSON.stringify({ items: [], orderData: {} }) });
      const data = await res.json();
      setStripeConnected(!data.error && res.ok);
    } catch {
      setStripeConnected(false);
    }
  }

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const failedPayments = payments.filter(p => p.status === 'failed').length;

  const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: '待支付' },
    paid: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: '已支付' },
    failed: { color: 'bg-red-100 text-red-800', icon: XCircle, label: '失败' },
    refunded: { color: 'bg-gray-100 text-gray-800', icon: RefreshCw, label: '已退款' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">支付管理</h1>
          <p className="text-gray-500">管理支付和交易记录</p>
        </div>
        <a
          href="https://dashboard.stripe.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
        >
          <ExternalLink size={18} />
          Stripe 面板
        </a>
      </div>

      {/* Stripe Status */}
      <div className={`rounded-xl p-4 ${stripeConnected ? 'bg-green-50' : 'bg-yellow-50'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${stripeConnected ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <CreditCard className={stripeConnected ? 'text-green-600' : 'text-yellow-600'} size={24} />
          </div>
          <div>
            <p className={`font-medium ${stripeConnected ? 'text-green-800' : 'text-yellow-800'}`}>
              Stripe {stripeConnected ? '已连接' : '未连接'}
            </p>
            <p className={`text-sm ${stripeConnected ? 'text-green-600' : 'text-yellow-600'}`}>
              {stripeConnected 
                ? '支付处理已激活'
                : '请添加 STRIPE_SECRET_KEY 以启用支付'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="text-purple-700" size={20} />
            </div>
            <span className="text-gray-500 text-sm">总营收</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-700" size={20} />
            </div>
            <span className="text-gray-500 text-sm">成功支付</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {payments.filter(p => p.status === 'paid').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-700" size={20} />
            </div>
            <span className="text-gray-500 text-sm">待支付</span>
          </div>
          <p className="text-2xl font-bold text-yellow-700">{pendingPayments}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="text-red-700" size={20} />
            </div>
            <span className="text-gray-500 text-sm">失败</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{failedPayments}</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">订单</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">客户</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">方式</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">日期</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">金额</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    暂无支付记录
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{payment.orderNumber}</td>
                    <td className="py-3 px-4 text-gray-600">{(payment as any).customerEmail}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                        <CreditCard size={12} />
                        {payment.method}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        statusConfig[payment.status]?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {statusConfig[payment.status]?.label || payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      ${payment.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
