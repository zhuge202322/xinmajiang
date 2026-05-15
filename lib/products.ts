// 真实产品数据来源：output/products.json + output/categories.json
// 经规范化后供页面使用，并保留旧字段（color / shortDesc / original / soon）以兼容现有组件
import productsJson from '@/output/products.json';
import categoriesJson from '@/output/categories.json';

// ──────── 类型 ────────
export type Category = {
  slug: string;
  name: string;
  url?: string;
  desc: string;
  enDesc: string;
  productSlugs: string[];
};

export type Feature = { title: string; desc: string };

export type RawOption = {
  code: string;
  name?: string;
  label?: string;
  image?: string;
  imageUrl?: string;
  swatchColor?: string;
  desc?: string;
  details?: string[];
  eta?: string;
  popular?: boolean;
  recommended?: boolean;
  price_adjust: number;
  sale_adjust: number;
};

export type ProductOptions = {
  body_color?: RawOption[];
  table_color?: RawOption[];
  tile_size?: RawOption[];
  tile_count?: RawOption[];
  tile_color?: RawOption[];
  leg_type?: RawOption[];
  shipping?: RawOption[];
};

export type Product = {
  slug: string;
  name: string; // = title
  shortDesc: string; // 描述前 60 字
  description: string;
  category: string; // 分类 slug
  categoryName: string;
  price: number; // sale price
  original: number; // 推算原价
  badges?: string[];
  color: string; // 占位色：取首个机身色或分类默认色
  features: Feature[];
  options: ProductOptions;
  images: string[];
  url: string;
  soon?: boolean;
  shippingMethods?: ('pickup' | 'fedex' | 'sea')[];
};

// ──────── 颜色映射（用于色块/卡片的视觉占位） ────────
export const BODY_SWATCH: Record<string, string> = {
  'moonlight-white': '#F2EEE6',
  champagne: '#D4B86A',
  'deep-space-gray': '#5C5C5C',
  'space-gray': '#5C5C5C',
  'noble-blue': '#234876',
  'amber-orange': '#D98A45',
};

export const TABLE_SWATCH: Record<string, string> = {
  gray: '#3D3D3D',
  green: '#1F6B3F',
  khaki: '#A89568',
  pink: '#D7A8A8',
};

export const TILE_SWATCH: Record<string, string> = {
  'blue-green': '#1F6B3F',
  'white-green': '#A8D5BA',
  'pink-green': '#D9B3C3',
};

export const LEG_SWATCH: Record<string, string> = {
  single: '#C9B997',
  double: '#A07F4F',
};

// ──────── 分类数据 ────────
type RawCategory = {
  slug: string;
  name: string;
  url: string;
  products: string[];
};

const CATEGORY_DESC: Record<string, { desc: string; enDesc: string }> = {
  'folding-4mouth': {
    desc: '四口机芯，安静洗牌，流畅出牌。四轮万向移动，方便收纳与摆放。',
    enDesc:
      'Four-port mechanism with quiet shuffling and smooth tile dispensing. Four universal swivel casters for easy movement and storage.',
  },
  'folding-rotary': {
    desc: '最新无柱旋翼机芯，一盘无需推牌，体验更流畅。',
    enDesc:
      'Latest pillar-less rotary mechanism. No need to push tiles in—a smoother gaming experience.',
  },
  'table-4mouth': {
    desc: '餐桌麻将两用，家具家电首选，生活与娱乐兼得。',
    enDesc: 'Dining table & mahjong dual-purpose. The ideal home furniture appliance.',
  },
  'table-rotary': {
    desc: '轻薄机身，餐桌实用兼顾，旋翼出牌更高效。',
    enDesc:
      'Slim chassis with practical dining-table function and efficient rotary tile dispensing.',
  },
  outdoor: {
    desc: '轻便小巧，随时随地享受麻将乐趣。',
    enDesc: 'Lightweight and portable—enjoy mahjong anytime, anywhere.',
  },
};

export const categories: Category[] = (categoriesJson as RawCategory[]).map((c) => ({
  slug: c.slug,
  name: c.name,
  url: c.url,
  desc: CATEGORY_DESC[c.slug]?.desc ?? '',
  enDesc: CATEGORY_DESC[c.slug]?.enDesc ?? '',
  productSlugs: c.products
    .map((u) => decodeURIComponent(u.replace(/\/$/, '').split('/').pop() || ''))
    .filter(Boolean),
}));

// 产品名 → 分类 slug 映射
const NAME_TO_SLUG: Record<string, string> = Object.fromEntries(
  (categoriesJson as RawCategory[]).map((c) => [c.name, c.slug])
);

// ──────── 产品数据 ────────
type RawProduct = {
  url: string;
  slug: string;
  title: string;
  sku?: string;
  price: string;
  currency: string;
  availability: string;
  categories: string[];
  description: string;
  features?: Feature[];
  options?: ProductOptions;
  images?: string[];
};

function shortenDesc(s: string, n = 60) {
  if (!s) return '';
  // 取第一个逗号/句号前内容，失败则截断
  const m = s.match(/[^，,。\.]+/);
  const head = m ? m[0] : s;
  return head.length > n ? head.slice(0, n) + '…' : head;
}

const PRODUCT_SLUG_OVERRIDES: Record<string, string> = {
  吉祥折叠麻将机: 'jixiangzhedie',
  吉祥餐桌麻将机: 'jixiangcanzhuo',
  易锦60折叠麻将机: 'yijin60zhedie',
  易锦60餐桌麻将机: 'yijin60canzhuo',
};

export const products: Product[] = (productsJson as RawProduct[])
  .filter((p) => p && p.slug)
  .map((p) => {
    const catName = p.categories?.[0] ?? '';
    const catSlug = NAME_TO_SLUG[catName] ?? 'other';
    const price = parseFloat(p.price || '0') || 0;
    const original = price > 0 ? Math.round(price * 1.25) : 0;
    const firstBody = p.options?.body_color?.[0]?.code ?? '';
    const color = BODY_SWATCH[firstBody] ?? '#7B5DA8';
    const shippingCodes = (p.options?.shipping ?? [])
      .map((s) => s.code)
      .filter((c): c is 'pickup' | 'fedex' | 'sea' => c === 'pickup' || c === 'fedex' || c === 'sea');
    return {
      slug: PRODUCT_SLUG_OVERRIDES[p.title] ?? p.slug,
      name: p.title,
      shortDesc: shortenDesc(p.description, 80),
      description: p.description ?? '',
      category: catSlug,
      categoryName: catName,
      price,
      original,
      badges: [],
      color,
      features: p.features ?? [],
      options: p.options ?? {},
      images: p.images ?? [],
      url: p.url,
      shippingMethods: shippingCodes.length > 0 ? shippingCodes : ['pickup', 'fedex', 'sea'],
    };
  });

// ──────── 工具函数 ────────
export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((p) => p.category === slug);
}
