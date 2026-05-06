'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Package
} from 'lucide-react';

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  stock: number;
  createdAt: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  'folding-4mouth': '折叠款四口机',
  'folding-rotary': '折叠款旋翼机',
  'table-4mouth': '餐桌款四口机',
  'table-rotary': '餐桌款旋翼机',
  outdoor: '户外麻将机',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('确定要删除此商品吗？')) return;
    
    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

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
          <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
          <p className="text-gray-500">管理商品目录</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors"
        >
          <Plus size={20} />
          添加商品
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="搜索商品..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">全部分类</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat] ?? cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">商品</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">分类</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">价格</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">库存</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    没有找到商品
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package size={24} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{CATEGORY_LABELS[product.category] ?? product.category}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">${product.price}</div>
                      {product.originalPrice > product.price && (
                        <div className="text-xs text-gray-400 line-through">
                          ${product.originalPrice}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={(product.stock ?? 999) <= 5 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                        {product.stock ?? 999}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {product.isActive && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            在售
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            推荐
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${product.slug}`}
                          className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50"
                          title="查看"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                          title="编辑"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="删除"
                        >
                          <Trash2 size={18} />
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

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            显示 {filteredProducts.length} / {products.length} 件商品
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
              上一页
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
