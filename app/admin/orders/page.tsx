'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Eye,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  Package,
  RefreshCw
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
  createdAt: string;
  items: any[];
};

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: '待处理' },
  confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: '已确认' },
  processing: { color: 'bg-purple-100 text-purple-800', icon: Package, label: '处理中' },
  shipped: { color: 'bg-indigo-100 text-indigo-800', icon: Truck, label: '已发货' },
  delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: '已送达' },
  cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: '已取消' },
  refunded: { color: 'bg-gray-100 text-gray-800', icon: RefreshCw, label: '已退款' },
};

const paymentConfig: Record<string, { color: string; label: string }> = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: '待支付' },
  paid: { color: 'bg-green-100 text-green-800', label: '已支付' },
  failed: { color: 'bg-red-100 text-red-800', label: '失败' },
  refunded: { color: 'bg-gray-100 text-gray-800', label: '已退款' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    } finally {
      setUpdating(false);
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
          <p className="text-gray-500">管理客户订单</p>
        </div>
        <button className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
          <Download size={20} />
          导出
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="总计" value={orders.length} />
        <StatCard label="待处理" value={orders.filter(o => o.status === 'pending').length} color="yellow" />
        <StatCard label="已支付" value={orders.filter(o => o.paymentStatus === 'paid').length} color="green" />
        <StatCard label="营收" value={`$${orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0).toLocaleString()}`} color="purple" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="搜索订单号、客户姓名或邮箱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">全部状态</option>
            <option value="pending">待处理</option>
            <option value="confirmed">已确认</option>
            <option value="processing">处理中</option>
            <option value="shipped">已发货</option>
            <option value="delivered">已送达</option>
            <option value="cancelled">已取消</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">全部支付</option>
            <option value="pending">待支付</option>
            <option value="paid">已支付</option>
            <option value="failed">失败</option>
            <option value="refunded">已退款</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">订单</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">客户</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">产品</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">日期</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">支付</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">金额</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    没有找到订单
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-xs text-gray-500">{order.items?.length || 0} 件商品</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600 max-w-[200px] truncate">
                        {order.items?.map((item: any) => item.name || item.productName).join(', ') || '-'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.items?.map((item: any) => `x${item.quantity || item.qty || 1}`).join(' ')}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        statusConfig[order.status]?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {statusConfig[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        paymentConfig[order.paymentStatus]?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {paymentConfig[order.paymentStatus]?.label || order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      ${order.total?.toLocaleString() || '0'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50"
                          title="查看详情"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
          updating={updating}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, color = 'gray' }: { label: string; value: string | number; color?: string }) {
  const colors: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${colors[color].split(' ')[1]}`}>{value}</p>
    </div>
  );
}

function OrderDetailModal({ 
  order, 
  onClose, 
  onUpdateStatus,
  updating 
}: { 
  order: Order; 
  onClose: () => void; 
  onUpdateStatus: (id: string, status: string) => void;
  updating: boolean;
}) {
  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const statusLabels: Record<string, string> = {
    pending: '待处理',
    confirmed: '已确认',
    processing: '处理中',
    shipped: '已发货',
    delivered: '已送达',
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">订单详情 {order.orderNumber}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">客户信息</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-1">
              <p><span className="text-gray-500">姓名:</span> {order.customerName}</p>
              <p><span className="text-gray-500">邮箱:</span> {order.customerEmail}</p>
              <p><span className="text-gray-500">电话:</span> {order.customerPhone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          {(order as any).shippingStreet && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">收货地址</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                <p>{order.customerName}</p>
                <p>{(order as any).shippingStreet}</p>
                <p>{(order as any).shippingCity}, {(order as any).shippingState} {(order as any).shippingZip}</p>
                <p>电话: {(order as any).shippingPhone || order.customerPhone}</p>
              </div>
            </div>
          )}
          
          {/* Items */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">商品信息</h3>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-lg">{item.name || item.productName}</p>
                      {item.slug && (
                        <p className="text-sm text-gray-500">SKU: {item.slug}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">数量: {item.quantity || item.qty || 1}</p>

                      {/* Configuration Details */}
                      {item.configuration && Object.keys(item.configuration).length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-2">选配 / Configuration:</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(item.configuration).map(([key, val]: [string, any]) => (
                              <span
                                key={key}
                                className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-xs text-gray-700 border border-gray-200"
                              >
                                {val.label || key}
                                {val.price > 0 && (
                                  <span className="text-purple-600">+${val.price}</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-lg ml-4">${((item.price || 0) * (item.quantity || item.qty || 1)).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Update Status */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">更新状态</h3>
            <div className="flex flex-wrap gap-2">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(order.id, status)}
                  disabled={updating || order.status === status}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    order.status === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  {statusLabels[status] || status}
                </button>
              ))}
            </div>
          </div>
          
          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-lg font-medium">合计</span>
            <span className="text-2xl font-bold text-purple-700">${order.total?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
