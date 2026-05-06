'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  X, 
  Plus, 
  GripVertical
} from 'lucide-react';
import Link from 'next/link';

type ProductForm = {
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  color: string;
  features: string[];
  images: string[];
  badges: string[];
  isActive: boolean;
  isFeatured: boolean;
};

const CATEGORIES = [
  { label: '折叠款四口机', value: 'folding-4mouth' },
  { label: '折叠款旋翼机', value: 'folding-rotary' },
  { label: '餐桌款四口机', value: 'table-4mouth' },
  { label: '餐桌款旋翼机', value: 'table-rotary' },
  { label: '户外麻将机', value: 'outdoor' },
];

const COLORS = [
  { name: '紫色', value: '#7B5DA8' },
  { name: '红色', value: '#C41E3A' },
  { name: '黑色', value: '#1a1a1a' },
  { name: '棕色', value: '#8B4513' },
  { name: '金色', value: '#D4AF37' },
  { name: '蓝色', value: '#1E4D8C' },
];

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProductForm>({
    name: '',
    slug: '',
    shortDesc: '',
    description: '',
    category: CATEGORIES[0].value,
    price: 0,
    originalPrice: 0,
    color: COLORS[0].value,
    features: [],
    images: [],
    badges: [],
    isActive: true,
    isFeatured: false,
  });
  const [newFeature, setNewFeature] = useState('');
  const [newBadge, setNewBadge] = useState('');

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setForm({ ...form, name, slug });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setForm({ ...form, features: [...form.features, newFeature.trim()] });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setForm({
      ...form,
      features: form.features.filter((_, i) => i !== index),
    });
  };

  const addBadge = () => {
    if (newBadge.trim()) {
      setForm({ ...form, badges: [...form.badges, newBadge.trim()] });
      setNewBadge('');
    }
  };

  const removeBadge = (index: number) => {
    setForm({
      ...form,
      badges: form.badges.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = () => {
    // Simulated image upload - in production, integrate with cloud storage
    const placeholderUrl = `https://picsum.photos/seed/${Date.now()}/600/400`;
    setForm({ ...form, images: [...form.images, placeholderUrl] });
  };

  const removeImage = (index: number) => {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          isActive: publish,
          price: Number(form.price),
          originalPrice: Number(form.originalPrice),
        }),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const data = await res.json();
        alert(data.error || '创建商品失败');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('创建商品失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">添加新商品</h1>
            <p className="text-gray-500">在商品目录中创建新的商品</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={(e) => handleSubmit(e, false)}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            保存草稿
          </button>
          <button
            onClick={(e) => handleSubmit(e, true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? '保存中...' : '发布商品'}
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">基础信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品名称 *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="例如：高端折叠自动麻将机"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL 别名 *
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="例如：premium-folding-mahjong-table"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  访问地址：/product/{form.slug || 'product-slug'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  简短描述 *
                </label>
                <input
                  type="text"
                  value={form.shortDesc}
                  onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                  placeholder="用于商品卡片展示的简短描述"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                 详细描述
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="请输入完整的商品介绍..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">商品图片</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {form.images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={img} alt={`商品图片 ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-purple-600 text-white text-xs rounded">
                      主图
                    </span>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleImageUpload}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-colors"
              >
                <Upload size={24} />
                <span className="text-sm">添加图片</span>
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              可添加多张图片，第一张图片将作为商品主图。
            </p>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">商品特色</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                placeholder="例如：可折叠设计"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Plus size={18} />
              </button>
            </div>
            <ul className="space-y-2">
              {form.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <GripVertical size={16} className="text-gray-400" />
                  <span className="flex-1">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">商品状态</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-sm">已发布</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-sm">推荐商品</span>
              </label>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">价格设置</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  销售价 *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={form.price || ''}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  对比原价
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={form.originalPrice || ''}
                    onChange={(e) => setForm({ ...form, originalPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  前台将以删除线形式显示原价。
                </p>
              </div>
            </div>
          </div>

          {/* Category & Color */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">分类与样式</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品分类 *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  主色调
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setForm({ ...form, color: c.value })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        form.color === c.value ? 'border-purple-600 ring-2 ring-purple-200' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">商品标签</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBadge())}
                placeholder="例如：热销推荐"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                type="button"
                onClick={addBadge}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.badges.map((badge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {badge}
                  <button
                    type="button"
                    onClick={() => removeBadge(index)}
                    className="hover:text-purple-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
