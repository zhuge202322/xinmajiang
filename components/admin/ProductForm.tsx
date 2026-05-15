'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  GripVertical,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

export type ColorOption = { name: string; value: string };
export type PricedOption = { value: string; priceAdjust: number };
export type MediaOption = { name: string; image: string; description?: string; priceAdjust?: number };
export type ShippingMethodCode = 'pickup' | 'fedex' | 'sea';

export type ProductFormState = {
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
  bodyColors: ColorOption[];
  tableColors: ColorOption[];
  tileSizes: PricedOption[];
  tileCounts: PricedOption[];
  tileColorOptions: MediaOption[];
  legModels: MediaOption[];
  shippingMethods: ShippingMethodCode[];
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

const TILE_COUNT_OPTIONS = ['108', '112', '120', '136', '144', '152'];

const SHIPPING_OPTIONS: { code: ShippingMethodCode; name: string; desc: string }[] = [
  { code: 'pickup', name: '仓库自提', desc: '美国本地仓库现货，下单后可预约自提' },
  { code: 'fedex', name: 'FedEx 派送', desc: '美国本地仓库现货，FedEx 派送上门' },
  { code: 'sea', name: '国内海运', desc: '国内仓库发货，海运约 30-45 个工作日' },
];

const EMPTY_FORM: ProductFormState = {
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
  bodyColors: [],
  tableColors: [],
  tileSizes: [],
  tileCounts: [],
  tileColorOptions: [],
  legModels: [],
  shippingMethods: [],
};

type Props = {
  mode: 'create' | 'edit';
  initial?: ProductFormState;
  productId?: string;
  heading?: string;
  subheading?: string;
};

export default function ProductForm({
  mode,
  initial,
  productId,
  heading,
  subheading,
}: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProductFormState>(initial ?? EMPTY_FORM);
  const [newFeature, setNewFeature] = useState('');
  const [newBadge, setNewBadge] = useState('');

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const [newBodyColor, setNewBodyColor] = useState<ColorOption>({ name: '', value: '#7B5DA8' });
  const [newTableColor, setNewTableColor] = useState<ColorOption>({ name: '', value: '#1F6B3F' });
  const [newTileSize, setNewTileSize] = useState<PricedOption>({ value: '', priceAdjust: 0 });
  const [newTileColor, setNewTileColor] = useState<MediaOption>({ name: '', image: '', description: '', priceAdjust: 0 });
  const [newLegModel, setNewLegModel] = useState<MediaOption>({ name: '', image: '', description: '', priceAdjust: 0 });

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const tileColorInputRef = useRef<HTMLInputElement>(null);
  const legModelInputRef = useRef<HTMLInputElement>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [tileColorUploading, setTileColorUploading] = useState(false);
  const [legModelUploading, setLegModelUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || '上传失败');
    return data.url as string;
  }

  const handleNameChange = (name: string) => {
    if (mode === 'edit') {
      setForm({ ...form, name });
      return;
    }
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
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) });
  };

  const addBadge = () => {
    if (newBadge.trim()) {
      setForm({ ...form, badges: [...form.badges, newBadge.trim()] });
      setNewBadge('');
    }
  };

  const removeBadge = (index: number) => {
    setForm({ ...form, badges: form.badges.filter((_, i) => i !== index) });
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setGalleryUploading(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i += 1) {
        const url = await uploadFile(files[i]);
        urls.push(url);
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err: any) {
      setUploadError(err?.message || '上传失败');
    } finally {
      setGalleryUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const addBodyColor = () => {
    if (!newBodyColor.name.trim()) return;
    setForm({ ...form, bodyColors: [...form.bodyColors, { ...newBodyColor }] });
    setNewBodyColor({ name: '', value: '#7B5DA8' });
  };

  const removeBodyColor = (index: number) => {
    setForm({ ...form, bodyColors: form.bodyColors.filter((_, i) => i !== index) });
  };

  const addTableColor = () => {
    if (!newTableColor.name.trim()) return;
    setForm({ ...form, tableColors: [...form.tableColors, { ...newTableColor }] });
    setNewTableColor({ name: '', value: '#1F6B3F' });
  };

  const removeTableColor = (index: number) => {
    setForm({ ...form, tableColors: form.tableColors.filter((_, i) => i !== index) });
  };

  const addTileSize = () => {
    const v = newTileSize.value.trim();
    if (!v) return;
    if (form.tileSizes.some((s) => s.value === v)) {
      setNewTileSize({ value: '', priceAdjust: 0 });
      return;
    }
    setForm({
      ...form,
      tileSizes: [...form.tileSizes, { value: v, priceAdjust: newTileSize.priceAdjust || 0 }],
    });
    setNewTileSize({ value: '', priceAdjust: 0 });
  };

  const removeTileSize = (index: number) => {
    setForm({ ...form, tileSizes: form.tileSizes.filter((_, i) => i !== index) });
  };

  const updateTileSizePrice = (index: number, priceAdjust: number) => {
    setForm({
      ...form,
      tileSizes: form.tileSizes.map((s, i) => (i === index ? { ...s, priceAdjust } : s)),
    });
  };

  const toggleTileCount = (code: string) => {
    setForm((prev) => ({
      ...prev,
      tileCounts: prev.tileCounts.some((c) => c.value === code)
        ? prev.tileCounts.filter((c) => c.value !== code)
        : [...prev.tileCounts, { value: code, priceAdjust: 0 }],
    }));
  };

  const updateTileCountPrice = (code: string, priceAdjust: number) => {
    setForm((prev) => ({
      ...prev,
      tileCounts: prev.tileCounts.map((c) => (c.value === code ? { ...c, priceAdjust } : c)),
    }));
  };

  const toggleAllTileCounts = () => {
    const allSelected = TILE_COUNT_OPTIONS.every((c) =>
      form.tileCounts.some((t) => t.value === c),
    );
    setForm({
      ...form,
      tileCounts: allSelected
        ? []
        : TILE_COUNT_OPTIONS.map((c) => {
            const exists = form.tileCounts.find((t) => t.value === c);
            return exists ?? { value: c, priceAdjust: 0 };
          }),
    });
  };

  const uploadMediaImage = async (
    file: File,
    setter: React.Dispatch<React.SetStateAction<MediaOption>>,
    setBusy: React.Dispatch<React.SetStateAction<boolean>>,
    inputRef: React.RefObject<HTMLInputElement>,
  ) => {
    setUploadError(null);
    setBusy(true);
    try {
      const url = await uploadFile(file);
      setter((prev) => ({ ...prev, image: url }));
    } catch (err: any) {
      setUploadError(err?.message || '上传失败');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const addTileColor = () => {
    if (!newTileColor.name.trim()) return;
    setForm({
      ...form,
      tileColorOptions: [
        ...form.tileColorOptions,
        { ...newTileColor, priceAdjust: newTileColor.priceAdjust || 0 },
      ],
    });
    setNewTileColor({ name: '', image: '', description: '', priceAdjust: 0 });
  };

  const removeTileColor = (index: number) => {
    setForm({ ...form, tileColorOptions: form.tileColorOptions.filter((_, i) => i !== index) });
  };

  const updateTileColorPrice = (index: number, priceAdjust: number) => {
    setForm({
      ...form,
      tileColorOptions: form.tileColorOptions.map((c, i) => (i === index ? { ...c, priceAdjust } : c)),
    });
  };

  const addLegModel = () => {
    if (!newLegModel.name.trim()) return;
    setForm({
      ...form,
      legModels: [
        ...form.legModels,
        { ...newLegModel, priceAdjust: newLegModel.priceAdjust || 0 },
      ],
    });
    setNewLegModel({ name: '', image: '', description: '', priceAdjust: 0 });
  };

  const removeLegModel = (index: number) => {
    setForm({ ...form, legModels: form.legModels.filter((_, i) => i !== index) });
  };

  const updateLegModelPrice = (index: number, priceAdjust: number) => {
    setForm({
      ...form,
      legModels: form.legModels.map((c, i) => (i === index ? { ...c, priceAdjust } : c)),
    });
  };

  const toggleShipping = (code: ShippingMethodCode) => {
    setForm((prev) => ({
      ...prev,
      shippingMethods: prev.shippingMethods.includes(code)
        ? prev.shippingMethods.filter((c) => c !== code)
        : [...prev.shippingMethods, code],
    }));
  };

  const toggleAllShipping = () => {
    const all = SHIPPING_OPTIONS.map((s) => s.code);
    const allSelected = all.every((c) => form.shippingMethods.includes(c));
    setForm({ ...form, shippingMethods: allSelected ? [] : all });
  };

  const onlySeaShipping = useMemo(
    () => form.shippingMethods.length === 1 && form.shippingMethods[0] === 'sea',
    [form.shippingMethods],
  );

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        isActive: publish,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice),
      };

      let res: Response;
      if (mode === 'edit' && productId) {
        res = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: productId, ...payload }),
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || (mode === 'edit' ? '更新商品失败' : '创建商品失败'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert(mode === 'edit' ? '更新商品失败' : '创建商品失败');
    } finally {
      setSaving(false);
    }
  };

  const submitLabel = mode === 'edit' ? '保存修改' : '发布商品';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{heading ?? (mode === 'edit' ? '编辑商品' : '添加新商品')}</h1>
            <p className="text-gray-500">{subheading ?? (mode === 'edit' ? '修改并保存商品信息' : '在商品目录中创建新的商品')}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {mode === 'create' && (
            <button
              onClick={(e) => handleSubmit(e, false)}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              保存草稿
            </button>
          )}
          <button
            onClick={(e) => handleSubmit(e, mode === 'edit' ? form.isActive : true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? '保存中...' : submitLabel}
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">基础信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品名称 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="例如：高端折叠自动麻将机"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL 别名 *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="例如：premium-folding-mahjong-table"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <p className="mt-1 text-sm text-gray-500">访问地址：/product/{form.slug || 'product-slug'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">简短描述 *</label>
                <input
                  type="text"
                  value={form.shortDesc}
                  onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                  placeholder="用于商品卡片展示的简短描述"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">详细描述</label>
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

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">商品图片</h2>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
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
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-purple-600 text-white text-xs rounded">主图</span>
                  )}
                </div>
              ))}
              <button
                type="button"
                disabled={galleryUploading}
                onClick={() => galleryInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-colors disabled:opacity-60 disabled:cursor-wait"
              >
                {galleryUploading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    <span className="text-sm">上传中...</span>
                  </>
                ) : (
                  <>
                    <Upload size={24} />
                    <span className="text-sm">添加图片</span>
                  </>
                )}
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-500">支持 JPG / PNG / WebP / GIF / AVIF，单张最大 10 MB；可一次选多张，第一张作为主图。</p>
            {uploadError && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-red-700">
                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                <p className="text-sm">{uploadError}</p>
              </div>
            )}
          </div>

          {/* 1. 机身颜色 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-semibold text-gray-900">机身颜色</h2>
              <span className="text-xs text-gray-500">已添加 {form.bodyColors.length} 项</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">填写颜色名称并选取色值，前台将作为可选项展示。</p>
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,auto] gap-2 mb-3">
              <input
                type="text"
                value={newBodyColor.name}
                onChange={(e) => setNewBodyColor({ ...newBodyColor, name: e.target.value })}
                placeholder="颜色名称，如：月光白"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <input
                type="color"
                value={newBodyColor.value}
                onChange={(e) => setNewBodyColor({ ...newBodyColor, value: e.target.value })}
                className="h-10 w-16 cursor-pointer rounded-lg border border-gray-300"
              />
              <button type="button" onClick={addBodyColor} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1">
                <Plus size={18} /> 添加
              </button>
            </div>
            <ul className="space-y-2">
              {form.bodyColors.map((c, index) => (
                <li key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <span className="inline-block h-6 w-6 rounded-full border border-gray-300" style={{ backgroundColor: c.value }} />
                  <span className="flex-1 text-sm">{c.name}</span>
                  <span className="text-xs text-gray-400">{c.value}</span>
                  <button type="button" onClick={() => removeBodyColor(index)} className="text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. 台面颜色 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-semibold text-gray-900">台面颜色（桌面颜色）</h2>
              <span className="text-xs text-gray-500">已添加 {form.tableColors.length} 项</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">桌面布料颜色可选项。</p>
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,auto] gap-2 mb-3">
              <input
                type="text"
                value={newTableColor.name}
                onChange={(e) => setNewTableColor({ ...newTableColor, name: e.target.value })}
                placeholder="颜色名称，如：墨绿色"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <input
                type="color"
                value={newTableColor.value}
                onChange={(e) => setNewTableColor({ ...newTableColor, value: e.target.value })}
                className="h-10 w-16 cursor-pointer rounded-lg border border-gray-300"
              />
              <button type="button" onClick={addTableColor} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1">
                <Plus size={18} /> 添加
              </button>
            </div>
            <ul className="space-y-2">
              {form.tableColors.map((c, index) => (
                <li key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <span className="inline-block h-6 w-6 rounded border border-gray-300" style={{ backgroundColor: c.value }} />
                  <span className="flex-1 text-sm">{c.name}</span>
                  <span className="text-xs text-gray-400">{c.value}</span>
                  <button type="button" onClick={() => removeTableColor(index)} className="text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. 麻将牌尺寸 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-semibold text-gray-900">麻将牌尺寸</h2>
              <span className="text-xs text-gray-500">已添加 {form.tileSizes.length} 项</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              输入尺寸号码，例如：40号、42号、46号 …<br />
              「额外费用」留空或填 0 即为免费；填正数会在前台显示 +$N。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-[1fr,140px,auto] gap-2 mb-3">
              <input
                type="text"
                value={newTileSize.value}
                onChange={(e) => setNewTileSize({ ...newTileSize, value: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTileSize())}
                placeholder="例如：40号"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+$</span>
                <input
                  type="number"
                  min={0}
                  step="1"
                  value={newTileSize.priceAdjust || ''}
                  onChange={(e) => setNewTileSize({ ...newTileSize, priceAdjust: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <button type="button" onClick={addTileSize} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1">
                <Plus size={18} /> 添加
              </button>
            </div>
            <ul className="space-y-2">
              {form.tileSizes.map((s, index) => (
                <li key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <span className="flex-1 text-sm font-medium text-gray-900">{s.value}</span>
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+$</span>
                    <input
                      type="number"
                      min={0}
                      step="1"
                      value={s.priceAdjust || ''}
                      onChange={(e) => updateTileSizePrice(index, parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full pl-9 pr-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <span className={`text-xs w-12 text-right ${s.priceAdjust > 0 ? 'text-wine font-medium' : 'text-emerald-600'}`}>
                    {s.priceAdjust > 0 ? `+$${s.priceAdjust}` : '免费'}
                  </span>
                  <button type="button" onClick={() => removeTileSize(index)} className="text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. 麻将牌张数 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-semibold text-gray-900">麻将牌张数</h2>
              <button type="button" onClick={toggleAllTileCounts} className="text-sm text-purple-700 hover:text-purple-900">
                {TILE_COUNT_OPTIONS.every((c) => form.tileCounts.some((t) => t.value === c)) ? '取消全选' : '全选'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">可多选；勾选后可在右侧填入「额外费用」，留空或 0 即为免费。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {TILE_COUNT_OPTIONS.map((code) => {
                const item = form.tileCounts.find((t) => t.value === code);
                const checked = !!item;
                return (
                  <div
                    key={code}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-colors ${
                      checked ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <label className="flex items-center gap-2 flex-1 cursor-pointer">
                      <input type="checkbox" checked={checked} onChange={() => toggleTileCount(code)} className="w-4 h-4 text-purple-600 rounded" />
                      <span className="text-sm font-medium text-gray-900">{code} 张</span>
                    </label>
                    {checked && (
                      <>
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">+$</span>
                          <input
                            type="number"
                            min={0}
                            step="1"
                            value={item.priceAdjust || ''}
                            onChange={(e) => updateTileCountPrice(code, parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="w-full pl-8 pr-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <span className={`text-xs w-12 text-right ${item.priceAdjust > 0 ? 'text-wine font-medium' : 'text-emerald-600'}`}>
                          {item.priceAdjust > 0 ? `+$${item.priceAdjust}` : '免费'}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. 麻将牌颜色 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-semibold text-gray-900">麻将牌颜色</h2>
              <span className="text-xs text-gray-500">已添加 {form.tileColorOptions.length} 项</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">每项包含：颜色名称、效果图、文字描述、额外费用（可选，0 = 免费）。</p>
            <div className="space-y-2">
              <input
                type="text"
                value={newTileColor.name}
                onChange={(e) => setNewTileColor({ ...newTileColor, name: e.target.value })}
                placeholder="名称，如：白绿仿玉石色"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <textarea
                value={newTileColor.description}
                onChange={(e) => setNewTileColor({ ...newTileColor, description: e.target.value })}
                rows={2}
                placeholder="文字描述..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <div className="flex items-center gap-3">
                <div className="relative w-36">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">额外 +$</span>
                  <input
                    type="number"
                    min={0}
                    step="1"
                    value={newTileColor.priceAdjust || ''}
                    onChange={(e) => setNewTileColor({ ...newTileColor, priceAdjust: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full pl-16 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <span className="text-xs text-gray-500">留空 / 0 = 免费</span>
              </div>
              <div className="flex items-center gap-3">
                {newTileColor.image ? (
                  <img src={newTileColor.image} alt="预览" className="h-16 w-16 rounded-lg object-cover border border-gray-200" />
                ) : (
                  <div className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                    <Upload size={20} />
                  </div>
                )}
                <input
                  ref={tileColorInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadMediaImage(f, setNewTileColor, setTileColorUploading, tileColorInputRef);
                  }}
                />
                <button
                  type="button"
                  disabled={tileColorUploading}
                  onClick={() => tileColorInputRef.current?.click()}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm disabled:opacity-60 disabled:cursor-wait inline-flex items-center gap-1"
                >
                  {tileColorUploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      上传中
                    </>
                  ) : (
                    '上传图片'
                  )}
                </button>
                <button
                  type="button"
                  onClick={addTileColor}
                  className="ml-auto px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 text-sm flex items-center gap-1"
                >
                  <Plus size={16} /> 添加该颜色
                </button>
              </div>
            </div>
            <ul className="mt-5 space-y-2">
              {form.tileColorOptions.map((c, index) => (
                <li key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="h-12 w-12 rounded object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded bg-gray-200" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{c.name}</div>
                    {c.description && <div className="text-xs text-gray-500 line-clamp-2">{c.description}</div>}
                  </div>
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">+$</span>
                    <input
                      type="number"
                      min={0}
                      step="1"
                      value={c.priceAdjust || ''}
                      onChange={(e) => updateTileColorPrice(index, parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full pl-8 pr-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <span className={`text-xs w-12 text-right ${(c.priceAdjust ?? 0) > 0 ? 'text-wine font-medium' : 'text-emerald-600'}`}>
                    {(c.priceAdjust ?? 0) > 0 ? `+$${c.priceAdjust}` : '免费'}
                  </span>
                  <button type="button" onClick={() => removeTileColor(index)} className="text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 6. 折叠腿型号 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-semibold text-gray-900">折叠腿型号</h2>
              <span className="text-xs text-gray-500">已添加 {form.legModels.length} 项</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">每项包含：型号名称、参考图、文字描述、额外费用（可选，0 = 免费）。</p>
            <div className="space-y-2">
              <input
                type="text"
                value={newLegModel.name}
                onChange={(e) => setNewLegModel({ ...newLegModel, name: e.target.value })}
                placeholder="名称，如：双折叠腿"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <textarea
                value={newLegModel.description}
                onChange={(e) => setNewLegModel({ ...newLegModel, description: e.target.value })}
                rows={2}
                placeholder="文字描述..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <div className="flex items-center gap-3">
                <div className="relative w-36">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">额外 +$</span>
                  <input
                    type="number"
                    min={0}
                    step="1"
                    value={newLegModel.priceAdjust || ''}
                    onChange={(e) => setNewLegModel({ ...newLegModel, priceAdjust: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full pl-16 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <span className="text-xs text-gray-500">留空 / 0 = 免费</span>
              </div>
              <div className="flex items-center gap-3">
                {newLegModel.image ? (
                  <img src={newLegModel.image} alt="预览" className="h-16 w-16 rounded-lg object-cover border border-gray-200" />
                ) : (
                  <div className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                    <Upload size={20} />
                  </div>
                )}
                <input
                  ref={legModelInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadMediaImage(f, setNewLegModel, setLegModelUploading, legModelInputRef);
                  }}
                />
                <button
                  type="button"
                  disabled={legModelUploading}
                  onClick={() => legModelInputRef.current?.click()}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm disabled:opacity-60 disabled:cursor-wait inline-flex items-center gap-1"
                >
                  {legModelUploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      上传中
                    </>
                  ) : (
                    '上传图片'
                  )}
                </button>
                <button
                  type="button"
                  onClick={addLegModel}
                  className="ml-auto px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 text-sm flex items-center gap-1"
                >
                  <Plus size={16} /> 添加该型号
                </button>
              </div>
            </div>
            <ul className="mt-5 space-y-2">
              {form.legModels.map((c, index) => (
                <li key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="h-12 w-12 rounded object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded bg-gray-200" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{c.name}</div>
                    {c.description && <div className="text-xs text-gray-500 line-clamp-2">{c.description}</div>}
                  </div>
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">+$</span>
                    <input
                      type="number"
                      min={0}
                      step="1"
                      value={c.priceAdjust || ''}
                      onChange={(e) => updateLegModelPrice(index, parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full pl-8 pr-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <span className={`text-xs w-12 text-right ${(c.priceAdjust ?? 0) > 0 ? 'text-wine font-medium' : 'text-emerald-600'}`}>
                    {(c.priceAdjust ?? 0) > 0 ? `+$${c.priceAdjust}` : '免费'}
                  </span>
                  <button type="button" onClick={() => removeLegModel(index)} className="text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 7. 发货方式 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-semibold text-gray-900">发货方式</h2>
              <button type="button" onClick={toggleAllShipping} className="text-sm text-purple-700 hover:text-purple-900">
                {SHIPPING_OPTIONS.every((s) => form.shippingMethods.includes(s.code)) ? '取消全选' : '全选'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">三种方式均为免运费，可单选或多选。</p>
            <div className="grid grid-cols-1 gap-2">
              {SHIPPING_OPTIONS.map((s) => {
                const checked = form.shippingMethods.includes(s.code);
                return (
                  <label
                    key={s.code}
                    className={`flex items-start gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                      checked ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <input type="checkbox" checked={checked} onChange={() => toggleShipping(s.code)} className="mt-1 w-4 h-4 text-purple-600 rounded" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{s.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
                    </div>
                    <span className="text-xs text-green-600 font-medium">免运费</span>
                  </label>
                );
              })}
            </div>

            {onlySeaShipping && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-amber-800">
                <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  仅勾选了「国内海运」——该商品在美国本地仓库 <strong>暂无现货</strong>，
                  前台将自动标记为「美国无货」，并不会出现在「仅看美国有货」列表中。
                </p>
              </div>
            )}
          </div>

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
              <button type="button" onClick={addFeature} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <Plus size={18} />
              </button>
            </div>
            <ul className="space-y-2">
              {form.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <GripVertical size={16} className="text-gray-400" />
                  <span className="flex-1">{feature}</span>
                  <button type="button" onClick={() => removeFeature(index)} className="text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
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

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">价格设置</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">销售价 *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">对比原价</label>
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
                <p className="mt-1 text-sm text-gray-500">前台将以删除线形式显示原价。</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">分类与样式</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品分类 *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">主色调</label>
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
              <button type="button" onClick={addBadge} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <Plus size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.badges.map((badge, index) => (
                <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {badge}
                  <button type="button" onClick={() => removeBadge(index)} className="hover:text-purple-900">
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
