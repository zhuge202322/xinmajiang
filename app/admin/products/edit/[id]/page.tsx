'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';
import ProductForm, {
  type ProductFormState,
  type PricedOption,
  type MediaOption,
  type ColorOption,
  type ShippingMethodCode,
} from '@/components/admin/ProductForm';

const VALID_SHIPPING: ShippingMethodCode[] = ['pickup', 'fedex', 'sea'];

function toPricedOption(item: unknown, index: number): PricedOption | null {
  if (typeof item === 'string') {
    return { value: item, priceAdjust: 0 };
  }
  if (item && typeof item === 'object') {
    const obj = item as Partial<PricedOption> & { code?: string; label?: string };
    const value = obj.value ?? obj.code ?? obj.label;
    if (typeof value === 'string' && value.length > 0) {
      const num = typeof obj.priceAdjust === 'number' ? obj.priceAdjust : Number(obj.priceAdjust ?? 0);
      return { value, priceAdjust: Number.isFinite(num) ? num : 0 };
    }
  }
  return null;
}

function toMediaOption(item: unknown): MediaOption | null {
  if (!item || typeof item !== 'object') return null;
  const obj = item as Partial<MediaOption>;
  if (typeof obj.name !== 'string') return null;
  const num = typeof obj.priceAdjust === 'number' ? obj.priceAdjust : Number(obj.priceAdjust ?? 0);
  return {
    name: obj.name,
    image: typeof obj.image === 'string' ? obj.image : '',
    description: typeof obj.description === 'string' ? obj.description : '',
    priceAdjust: Number.isFinite(num) ? num : 0,
  };
}

function toColorOption(item: unknown): ColorOption | null {
  if (!item || typeof item !== 'object') return null;
  const obj = item as Partial<ColorOption>;
  if (typeof obj.name !== 'string' || typeof obj.value !== 'string') return null;
  return { name: obj.name, value: obj.value };
}

function normalize(product: any): ProductFormState {
  return {
    name: product.name ?? '',
    slug: product.slug ?? '',
    shortDesc: product.shortDesc ?? product.short_desc ?? '',
    description: product.description ?? '',
    category: product.category ?? 'folding-4mouth',
    price: Number(product.price ?? 0),
    originalPrice: Number(product.originalPrice ?? product.original_price ?? 0),
    color: product.color ?? '#7B5DA8',
    features: Array.isArray(product.features) ? product.features.filter((f: any) => typeof f === 'string') : [],
    images: Array.isArray(product.images) ? product.images.filter((i: any) => typeof i === 'string') : [],
    badges: Array.isArray(product.badges) ? product.badges.filter((b: any) => typeof b === 'string') : [],
    isActive: Boolean(product.isActive ?? product.is_active ?? true),
    isFeatured: Boolean(product.isFeatured ?? product.is_featured ?? false),
    bodyColors: Array.isArray(product.bodyColors)
      ? (product.bodyColors.map(toColorOption).filter(Boolean) as ColorOption[])
      : [],
    tableColors: Array.isArray(product.tableColors)
      ? (product.tableColors.map(toColorOption).filter(Boolean) as ColorOption[])
      : [],
    tileSizes: Array.isArray(product.tileSizes)
      ? (product.tileSizes.map(toPricedOption).filter(Boolean) as PricedOption[])
      : [],
    tileCounts: Array.isArray(product.tileCounts)
      ? (product.tileCounts.map(toPricedOption).filter(Boolean) as PricedOption[])
      : [],
    tileColorOptions: Array.isArray(product.tileColorOptions)
      ? (product.tileColorOptions.map(toMediaOption).filter(Boolean) as MediaOption[])
      : [],
    legModels: Array.isArray(product.legModels)
      ? (product.legModels.map(toMediaOption).filter(Boolean) as MediaOption[])
      : [],
    shippingMethods: Array.isArray(product.shippingMethods)
      ? (product.shippingMethods.map(toPricedOption).filter((c: PricedOption | null) => c && VALID_SHIPPING.includes(c.value as any)) as PricedOption[])
      : [],
  };
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [initial, setInitial] = useState<ProductFormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isCatalog = params.id.startsWith('catalog_');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/products?id=${encodeURIComponent(params.id)}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || '加载失败');
        }
        if (!cancelled) {
          setInitial(normalize(data.product));
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.message || '加载失败');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (isCatalog) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">无法编辑此商品</h1>
            <p className="text-gray-500">该商品来自内置目录</p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-300 text-amber-800 rounded-xl p-6 flex items-start gap-3">
          <AlertTriangle className="mt-0.5 flex-shrink-0" size={20} />
          <div className="space-y-2 text-sm">
            <p>该商品（ID：<code className="bg-white/60 px-1.5 py-0.5 rounded">{params.id}</code>）来自仓库的内置目录（output/products.json），目前不支持在后台直接编辑。</p>
            <p>如需修改，请：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>使用「添加商品」创建一个新的、可在后台维护的同款商品；或</li>
              <li>直接修改 <code className="bg-white/60 px-1.5 py-0.5 rounded">output/products.json</code> 后重启服务。</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" size={20} /> 正在加载商品数据...
      </div>
    );
  }

  if (error || !initial) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">加载失败</h1>
        </div>
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl p-6 flex items-start gap-3">
          <AlertTriangle className="mt-0.5 flex-shrink-0" size={20} />
          <p className="text-sm">{error || '未找到此商品'}</p>
        </div>
      </div>
    );
  }

  return (
    <ProductForm
      mode="edit"
      productId={params.id}
      initial={initial}
      heading={`编辑商品：${initial.name}`}
      subheading="修改并保存后立即生效"
    />
  );
}
