// 对话式配置器步骤定义：直接由产品的 options 动态生成
import {
  Product,
  RawOption,
  BODY_SWATCH,
  TABLE_SWATCH,
  TILE_SWATCH,
  LEG_SWATCH,
} from './products';

export type ConfigOption = {
  id: string;
  label: string;
  sub?: string;
  price?: number;
  origPrice?: number; // 划线原价（如 +$30 但显示原 +$60）
  badge?: 'recommend' | 'common' | 'free';
  swatch?: string;
  imageColor?: string;
  imageUrl?: string;
};

export type ConfigStep = {
  key: string;
  prompt: string;
  highlight: string;
  desc?: string;
  layout: 'swatch' | 'grid' | 'list' | 'cards' | 'shipping';
  options: ConfigOption[];
};

const STEP_PROMPTS: Record<
  string,
  { prompt: string; highlight: string; desc?: string; layout: ConfigStep['layout'] }
> = {
  body_color: {
    prompt: '首先，请选择您喜欢的机身颜色',
    highlight: '机身颜色',
    layout: 'swatch',
  },
  table_color: {
    prompt: '其次，选择您满意的台面颜色',
    highlight: '台面颜色',
    desc: '台面采用美绒材质，触感细腻。',
    layout: 'swatch',
  },
  tile_size: {
    prompt: '请按地区或者个人喜好选择麻将牌尺寸吧',
    highlight: '麻将牌尺寸',
    desc: '精选优质材料，手感温润光滑。',
    layout: 'grid',
  },
  tile_count: {
    prompt: '请选择麻将牌张数',
    highlight: '麻将牌张数',
    desc: '多张数玩法更多，小张数则更基础。',
    layout: 'list',
  },
  tile_color: {
    prompt: '需要什么颜色麻将牌？',
    highlight: '麻将牌',
    desc: '默认送两幅麻将，颜色不同哦。',
    layout: 'cards',
  },
  leg_type: {
    prompt: '最后一步，选择折叠腿型号',
    highlight: '折叠腿',
    desc: '双折叠腿更轻巧，更省空间。',
    layout: 'cards',
  },
  shipping: {
    prompt: '请选择发货方式',
    highlight: '发货方式',
    desc: '您选择的配置可从指定仓库或国内工厂发出。',
    layout: 'shipping',
  },
};

// 顺序固定，按这个顺序检查产品是否有该 option
const STEP_ORDER: (keyof Required<NonNullable<Product['options']>>)[] = [
  'body_color',
  'table_color',
  'tile_size',
  'tile_count',
  'tile_color',
  'leg_type',
  'shipping',
];

function priceLabel(price: number) {
  if (!price) return '免费';
  return `+$${price}`;
}

function mapOption(stepKey: string, raw: RawOption): ConfigOption {
  const label = raw.name || raw.label || raw.code;
  // 价格：sale_adjust 是销售实际加价；price_adjust 是“原价加价”，用于划线
  const price = raw.sale_adjust ?? 0;
  const orig = raw.price_adjust ?? 0;
  const origPrice = orig > price ? orig : undefined;

  const opt: ConfigOption = {
    id: raw.code,
    label,
    sub: raw.desc,
    price,
    origPrice,
  };

  if (raw.popular) opt.badge = 'common';
  if (raw.recommended) opt.badge = 'recommend';

  // 视觉：优先使用后台填写的色值/上传的真实图片，回退到内置 swatch 表
  if (stepKey === 'body_color') {
    opt.swatch = raw.swatchColor || BODY_SWATCH[raw.code] || '#999';
  } else if (stepKey === 'table_color') {
    opt.swatch = raw.swatchColor || TABLE_SWATCH[raw.code] || '#999';
  } else if (stepKey === 'tile_color') {
    if (raw.imageUrl) opt.imageUrl = raw.imageUrl;
    opt.imageColor = TILE_SWATCH[raw.code] ?? '#999';
  } else if (stepKey === 'leg_type') {
    if (raw.imageUrl) opt.imageUrl = raw.imageUrl;
    opt.imageColor = LEG_SWATCH[raw.code] ?? '#999';
  } else if (stepKey === 'shipping') {
    // 把 details 拼到 sub 中（每行一条）
    const lines = [raw.eta, ...(raw.details ?? [])].filter(Boolean) as string[];
    if (lines.length) opt.sub = lines.join('\n');
    opt.badge = 'free';
  }

  return opt;
}

export function getStepsForProduct(product: Product): ConfigStep[] {
  const steps: ConfigStep[] = [];
  for (const key of STEP_ORDER) {
    const raws = product.options?.[key];
    if (!raws || raws.length === 0) continue;
    const meta = STEP_PROMPTS[key];
    if (!meta) continue;
    steps.push({
      key,
      prompt: meta.prompt,
      highlight: meta.highlight,
      desc: meta.desc,
      layout: meta.layout,
      options: raws.map((r) => mapOption(key, r)),
    });
  }
  return steps;
}

// 友好中文标签（用于"配置清单"）
export const STEP_LABEL: Record<string, string> = {
  body_color: '机身颜色',
  table_color: '台面颜色',
  tile_size: '麻将尺寸',
  tile_count: '麻将张数',
  tile_color: '麻将配色',
  leg_type: '折叠腿款式',
  shipping: '发货方式',
};
