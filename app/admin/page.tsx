import { getAllOrders, getAllProducts, getDatabase } from '@/lib/db';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users,
  TrendingUp,
  Clock
} from 'lucide-react';

async function getStats() {
  try {
    const orders = await getAllOrders();
    const products = await getAllProducts();
    const db = await getDatabase();
    
    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const recentOrders = orders.slice(0, 5);
    
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      totalUsers: db.users.length,
      pendingOrders,
      recentOrders,
    };
  } catch {
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalUsers: 0,
      pendingOrders: 0,
      recentOrders: [],
    };
  }
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">控制台</h1>
        <p className="text-gray-500">中雀麻将管理后台</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总营收"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+12.5%"
          trendUp
        />
        <StatCard
          title="总订单"
          value={stats.totalOrders.toString()}
          icon={ShoppingCart}
          trend={`${stats.pendingOrders} 待处理`}
          trendUp={false}
        />
        <StatCard
          title="商品"
          value={stats.totalProducts.toString()}
          icon={Package}
          trend="在售"
          trendUp
        />
        <StatCard
          title="用户"
          value={stats.totalUsers.toString()}
          icon={Users}
          trend="注册用户"
          trendUp
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">最近订单</h2>
          <a href="/admin/orders" className="text-sm text-purple-600 hover:text-purple-700">
            查看全部
          </a>
        </div>
        
        {stats.recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">暂无订单</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">订单号</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">客户</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">支付</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">金额</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        statusColors[order.status] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        paymentStatusColors[order.paymentStatus] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      ${order.total?.toLocaleString() || '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickAction
          title="添加商品"
          description="创建新的商品"
          href="/admin/products/new"
        />
        <QuickAction
          title="处理订单"
          description="管理待处理订单"
          href="/admin/orders"
        />
        <QuickAction
          title="系统设置"
          description="配置网站选项"
          href="/admin/settings"
        />
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp 
}: { 
  title: string; 
  value: string; 
  icon: any; 
  trend: string; 
  trendUp: boolean;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Icon className="text-purple-700" size={24} />
        </div>
        <span className={`flex items-center gap-1 text-sm ${trendUp ? 'text-green-600' : 'text-yellow-600'}`}>
          <TrendingUp size={14} className={trendUp ? '' : 'rotate-180'} />
          {trend}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-gray-500 text-sm">{title}</p>
    </div>
  );
}

function QuickAction({ 
  title, 
  description, 
  href 
}: { 
  title: string; 
  description: string; 
  href: string; 
}) {
  return (
    <a 
      href={href}
      className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </a>
  );
}
