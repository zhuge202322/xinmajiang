import * as db from '@/lib/db';
import {
  categories,
  getCategory,
  products as catalogProducts,
  Product,
  ProductOptions,
  RawOption,
} from '@/lib/products';

const defaultProductOptions: ProductOptions = {
  body_color: [
    { code: 'moonlight-white', name: '月光白', price_adjust: 0, sale_adjust: 0 },
    { code: 'champagne', name: '香槟金', price_adjust: 0, sale_adjust: 0 },
    { code: 'deep-space-gray', name: '深空灰', price_adjust: 0, sale_adjust: 0 },
    { code: 'noble-blue', name: '贵族蓝', price_adjust: 0, sale_adjust: 0 },
    { code: 'amber-orange', name: '琥珀橙', price_adjust: 50, sale_adjust: 0 },
  ],
  table_color: [
    { code: 'gray', name: '灰色', image: 'table-gray.webp', price_adjust: 0, sale_adjust: 0 },
    { code: 'green', name: '绿色', image: 'table-green.webp', price_adjust: 0, sale_adjust: 0 },
    { code: 'khaki', name: '卡其色', image: 'table-khaki.webp', price_adjust: 0, sale_adjust: 0 },
    { code: 'pink', name: '粉色', image: 'table-pink.webp', price_adjust: 0, sale_adjust: 0 },
  ],
  tile_size: [
    { code: '40', label: '40号', price_adjust: 0, sale_adjust: 0 },
    { code: '42', label: '42号', price_adjust: 0, sale_adjust: 0 },
    { code: '44', label: '44号', price_adjust: 0, sale_adjust: 0 },
    { code: '46', label: '46号', price_adjust: 0, sale_adjust: 0 },
    { code: '48', label: '48号', price_adjust: 30, sale_adjust: 15 },
    { code: '50', label: '50号', price_adjust: 30, sale_adjust: 15 },
    { code: '52', label: '52号', price_adjust: 50, sale_adjust: 25 },
    { code: '54', label: '54号', price_adjust: 50, sale_adjust: 25 },
    { code: '56', label: '56号', price_adjust: 50, sale_adjust: 25 },
  ],
  tile_count: [
    { code: '108', label: '108张', desc: '包含：条、筒、万', popular: false, price_adjust: 0, sale_adjust: 0 },
    { code: '112', label: '112张', desc: '包含：条、筒、万、红中', popular: false, price_adjust: 0, sale_adjust: 0 },
    { code: '120', label: '120张', desc: '包含：条、筒、万、红中、发财、白板', popular: false, price_adjust: 0, sale_adjust: 0 },
    { code: '136', label: '136张', desc: '包含：条、筒、万、红中、发财、白板、东南西北风', popular: false, price_adjust: 100, sale_adjust: 0 },
    { code: '144', label: '144张', desc: '包含：136张基础 + 八张花牌', popular: true, price_adjust: 120, sale_adjust: 0 },
    { code: '152', label: '152张', desc: '包含：136张基础 + 八张花牌+八张百搭牌', popular: false, price_adjust: 150, sale_adjust: 100 },
  ],
  tile_color: [
    { code: 'blue-green', name: '普通蓝绿色', image: 'mahjong-blue-green.webp', price_adjust: 0, sale_adjust: 0 },
    { code: 'white-green', name: '白绿仿玉石色', image: 'mahjong-white-green.webp', price_adjust: 50, sale_adjust: 0 },
    { code: 'pink-green', name: '粉绿仿玉石色', image: 'mahjong-pink-green.webp', price_adjust: 50, sale_adjust: 0 },
  ],
  leg_type: [
    { code: 'single', name: '单折叠腿', image: 'leg-single.webp', desc: '经典的折叠腿，最常选择的一个型号', recommended: false, price_adjust: 0, sale_adjust: 0 },
    { code: 'double', name: '双折叠腿', image: 'leg-double.webp', desc: '折叠更省空间，更适合麻将机收纳放置', recommended: true, price_adjust: 60, sale_adjust: 30 },
  ],
  shipping: [
    {
      code: 'sea',
      name: '国内海运',
      desc: '包邮',
      eta: '下单后48小时内发货，海运约30-45个工作日到达',
      details: [
        '美国48州包邮，大件物流卡车派送到门',
        '下单后国内仓库48小时内打木架分拣出库',
        '国内国际物流全程跟踪，货物入仓出仓拍摄照片',
        '货物入仓之前支持无理由退换',
      ],
      price_adjust: 0,
      sale_adjust: 0,
    },
    {
      code: 'pickup',
      name: '仓库自提',
      desc: '免运费',
      eta: '库存现货，预约后当天可提货',
      details: ['美国本土包邮，FedEx派送上门', '下单后2个工作日内发货', '支持到现货仓库自提'],
      price_adjust: 0,
      sale_adjust: 0,
    },
    {
      code: 'fedex',
      name: 'FedEx派送',
      desc: '免运费',
      eta: '现货产品 3-5 个工作日送达',
      details: ['美国本土包邮，FedEx派送上门', '下单后2个工作日内发货', '支持到现货仓库自提'],
      price_adjust: 0,
      sale_adjust: 0,
    },
  ],
};

function hasOptionItems(value: unknown): value is RawOption[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === 'object' && item !== null && typeof (item as RawOption).code === 'string')
  );
}

const SHIPPING_META: Record<string, { name: string; eta: string; details: string[] }> = {
  pickup: {
    name: '仓库自提',
    eta: '库存现货，预约后当天可提货',
    details: ['美国本土现货', '下单后2个工作日内可自提', '现场查验后再提货'],
  },
  fedex: {
    name: 'FedEx 派送',
    eta: '现货产品 3-5 个工作日送达',
    details: ['美国48州包邮', 'FedEx 派送上门', '下单后2个工作日内发货'],
  },
  sea: {
    name: '国内海运',
    eta: '下单后48小时内发货，海运约30-45个工作日到达',
    details: [
      '美国48州包邮，大件物流卡车派送到门',
      '国内仓库48小时内打木架分拣出库',
      '货物入仓之前支持无理由退换',
    ],
  },
};

function slugifyCode(value: string, fallback: string) {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized || fallback;
}

function buildOptionsFromAdminProduct(product: db.Product): ProductOptions {
  const opts: ProductOptions = {};

  if (Array.isArray(product.bodyColors) && product.bodyColors.length > 0) {
    opts.body_color = product.bodyColors.map((c, i) => ({
      code: slugifyCode(c.name, `body-${i + 1}`),
      name: c.name,
      swatchColor: c.value,
      price_adjust: 0,
      sale_adjust: 0,
    }));
  }

  if (Array.isArray(product.tableColors) && product.tableColors.length > 0) {
    opts.table_color = product.tableColors.map((c, i) => ({
      code: slugifyCode(c.name, `table-${i + 1}`),
      name: c.name,
      swatchColor: c.value,
      price_adjust: 0,
      sale_adjust: 0,
    }));
  }

  if (Array.isArray(product.tileSizes) && product.tileSizes.length > 0) {
    opts.tile_size = product.tileSizes.map((s, i) => {
      const val = typeof s === 'string' ? s : s.value;
      const price = typeof s === 'object' ? (s.priceAdjust ?? 0) : 0;
      return {
        code: slugifyCode(val, `size-${i + 1}`),
        label: val,
        price_adjust: price,
        sale_adjust: price,
      };
    });
  }

  if (Array.isArray(product.tileCounts) && product.tileCounts.length > 0) {
    opts.tile_count = product.tileCounts.map((c) => {
      const val = typeof c === 'string' ? c : c.value;
      const price = typeof c === 'object' ? (c.priceAdjust ?? 0) : 0;
      return {
        code: val,
        label: `${val}张`,
        price_adjust: price,
        sale_adjust: price,
      };
    });
  }

  if (Array.isArray(product.tileColorOptions) && product.tileColorOptions.length > 0) {
    opts.tile_color = product.tileColorOptions.map((c, i) => ({
      code: slugifyCode(c.name, `tile-${i + 1}`),
      name: c.name,
      desc: c.description,
      imageUrl: c.image || undefined,
      price_adjust: c.priceAdjust ?? 0,
      sale_adjust: c.priceAdjust ?? 0,
    }));
  }

  if (Array.isArray(product.legModels) && product.legModels.length > 0) {
    opts.leg_type = product.legModels.map((c, i) => ({
      code: slugifyCode(c.name, `leg-${i + 1}`),
      name: c.name,
      desc: c.description,
      imageUrl: c.image || undefined,
      price_adjust: c.priceAdjust ?? 0,
      sale_adjust: c.priceAdjust ?? 0,
    }));
  }

  if (Array.isArray(product.shippingMethods) && product.shippingMethods.length > 0) {
    opts.shipping = product.shippingMethods.map((s) => {
      const code = typeof s === 'string' ? s : s.value;
      const priceAdjust = typeof s === 'object' ? (s.priceAdjust ?? 0) : 0;
      const meta = SHIPPING_META[code];
      return {
        code,
        name: meta?.name ?? code,
        desc: priceAdjust > 0 ? `+$${priceAdjust}` : '免运费',
        eta: meta?.eta,
        details: meta?.details,
        price_adjust: priceAdjust,
        sale_adjust: priceAdjust,
      };
    });
  }

  return opts;
}

function withDefaultOptions(
  options: unknown,
  adminOptions?: ProductOptions,
): ProductOptions {
  const current = options as ProductOptions | undefined;
  const pick = (
    key: keyof ProductOptions,
  ): RawOption[] => {
    if (hasOptionItems(adminOptions?.[key])) return adminOptions![key]!;
    if (hasOptionItems(current?.[key])) return current![key]!;
    return defaultProductOptions[key]!;
  };
  return {
    body_color: pick('body_color'),
    table_color: pick('table_color'),
    tile_size: pick('tile_size'),
    tile_count: pick('tile_count'),
    tile_color: pick('tile_color'),
    leg_type: pick('leg_type'),
    shipping: pick('shipping'),
  };
}

function toStorefrontProduct(product: db.Product): Product {
  const adminOptions = buildOptionsFromAdminProduct(product);
  return {
    slug: product.slug,
    name: product.name,
    shortDesc: product.shortDesc,
    description: product.description,
    category: product.category,
    categoryName: product.categoryName,
    price: product.price,
    original: product.originalPrice,
    badges: product.badges,
    color: product.color,
    features: product.features.map((feature) => ({ title: feature, desc: '' })),
    options: withDefaultOptions(product.options, adminOptions),
    images: product.images,
    url: `/product/${product.slug}`,
    shippingMethods:
      Array.isArray(product.shippingMethods) && product.shippingMethods.length > 0
        ? product.shippingMethods.map((s) => (typeof s === 'string' ? s : s.value)) as ('pickup' | 'fedex' | 'sea')[]
        : ['pickup', 'fedex', 'sea'],
  };
}

export async function getAllStorefrontProducts() {
  const databaseProducts = await db.getAllProducts();
  const catalogSlugs = new Set(catalogProducts.map((product) => product.slug));
  const customProducts = databaseProducts
    .filter((product) => !catalogSlugs.has(product.slug))
    .map(toStorefrontProduct);

  return [...catalogProducts, ...customProducts];
}

export async function getStorefrontProduct(slug: string) {
  const products = await getAllStorefrontProducts();
  return products.find((product) => product.slug === slug);
}

export async function getStorefrontProductsByCategory(slug: string) {
  const products = await getAllStorefrontProducts();
  return products.filter((product) => product.category === slug);
}

export async function getStorefrontCategory(slug: string) {
  return getCategory(slug);
}

export { categories, catalogProducts };
