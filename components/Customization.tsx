'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShoppingBag,
  Check,
  Heart,
  RotateCcw,
  Send,
  ClipboardList,
  HelpCircle,
  Star,
  X,
  MessageCircle,
} from 'lucide-react';
import type { Product } from '@/lib/products';
import { getStepsForProduct } from '@/lib/configurator';
import type { ConfigStep, ConfigOption } from '@/lib/configurator';
import { STEP_LABEL } from '@/lib/configurator';
import ProductImage from './ProductImage';

type CustomizationCategory = { slug: string; name: string; desc: string };

// ─── 头像与气泡 ──────────────────────────────────────────────
function BotAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/60 bg-cream text-wine">
      <ShoppingBag size={14} />
    </div>
  );
}

function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <BotAvatar />
      <div className="relative max-w-[85%] rounded-2xl rounded-tl-sm border border-gold/40 bg-white px-4 py-2 text-[13px] leading-relaxed text-wine-dark shadow-sm">
        <span className="absolute -left-[6px] top-3 h-2.5 w-2.5 rotate-45 border-b border-l border-gold/40 bg-white" />
        {children}
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="relative max-w-[85%] rounded-2xl rounded-tr-sm bg-wine-deeper px-4 py-2 text-[13px] text-cream shadow-sm">
        <span className="absolute -right-[5px] top-2.5 h-2.5 w-2.5 rotate-45 bg-wine-deeper" />
        {text}
      </div>
    </div>
  );
}

// ─── 选项控件 ────────────────────────────────────────────────
function CornerCheck() {
  return (
    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-wine text-cream shadow-sm">
      <Check size={10} strokeWidth={3} />
    </span>
  );
}

function SwatchOption({
  opt,
  active,
  onClick,
}: {
  opt: ConfigOption;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-[12px] transition ${
        active ? 'border-2 border-wine shadow-md' : 'border-gold/40 hover:border-gold'
      }`}
    >
      {opt.swatch && (
        <span
          className="h-5 w-5 rounded-full border border-black/10"
          style={{ background: opt.swatch }}
        />
      )}
      <span className="text-wine-dark">{opt.label}</span>
      {active && <CornerCheck />}
    </button>
  );
}

function GridOption({
  opt,
  active,
  onClick,
}: {
  opt: ConfigOption;
  active: boolean;
  onClick: () => void;
}) {
  const free = !opt.price;
  return (
    <button
      onClick={onClick}
      className={`relative rounded-md border bg-white px-3 py-2 text-center transition ${
        active ? 'border-2 border-wine shadow-md' : 'border-gold/40 hover:border-gold'
      }`}
    >
      <div className="font-serif text-[15px] font-medium text-wine-dark">{opt.label}</div>
      <div className={`mt-0.5 text-[11px] ${free ? 'text-emerald-600' : 'text-wine'}`}>
        {free ? '免费' : (
          <>
            {opt.origPrice && <span className="mr-0.5 text-wine-dark/40 line-through">+${opt.origPrice}</span>}
            +${opt.price}
          </>
        )}
      </div>
      {active && <CornerCheck />}
    </button>
  );
}

function ListOption({
  opt,
  active,
  onClick,
}: {
  opt: ConfigOption;
  active: boolean;
  onClick: () => void;
}) {
  const free = !opt.price;
  return (
    <button
      onClick={onClick}
      className={`relative flex w-full items-center justify-between rounded-md border px-4 py-2.5 text-left transition ${
        active
          ? 'border-2 border-wine bg-gold-soft/40 shadow-md'
          : 'border-gold/40 bg-white hover:border-gold'
      }`}
    >
      <div>
        <div className="font-serif text-[14px] font-medium text-wine-dark">{opt.label}</div>
        {opt.sub && <div className="mt-0.5 text-[11px] text-wine-dark/60 line-clamp-1">{opt.sub}</div>}
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {opt.badge === 'common' && (
          <span className="rounded bg-wine px-1.5 py-0.5 text-[10px] text-cream">常用</span>
        )}
        <span className={`text-[12px] ${free ? 'text-emerald-600' : 'text-wine'}`}>
          {free ? '免费' : `+$${opt.price}`}
        </span>
      </div>
      {active && <CornerCheck />}
    </button>
  );
}

function CardOption({
  opt,
  active,
  onClick,
}: {
  opt: ConfigOption;
  active: boolean;
  onClick: () => void;
}) {
  const free = !opt.price;
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-lg border bg-white text-left transition ${
        active ? 'border-2 border-wine shadow-md' : 'border-gold/40 hover:border-gold'
      }`}
    >
      <div className="relative aspect-[4/3] w-full">
        {opt.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={opt.imageUrl}
            alt={opt.label}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(135deg, ${opt.imageColor || '#C9B997'} 0%, #f5ead8 100%)`,
            }}
          >
            <div className="flex h-full w-full items-center justify-center font-serif text-[14px] text-cream/90 mix-blend-overlay">
              {opt.label}
            </div>
          </div>
        )}
        {opt.badge === 'recommend' && (
          <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-0.5 rounded bg-gold px-1.5 py-0.5 text-[10px] text-wine-deeper">
            <Star size={8} fill="#5A4080" strokeWidth={0} /> 推荐
          </span>
        )}
      </div>
      <div className="px-3 py-2 text-center">
        <div className="font-serif text-[13px] font-medium text-wine-dark">{opt.label}</div>
        <div className={`mt-1 text-[11px] ${free ? 'text-emerald-600' : 'text-wine'}`}>
          {free ? '免费' : `+$${opt.price}`}
        </div>
      </div>
      {active && <CornerCheck />}
    </button>
  );
}

function ShippingOption({
  opt,
  active,
  onClick,
}: {
  opt: ConfigOption;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex w-full flex-col rounded-lg border px-4 py-3 text-left transition ${
        active
          ? 'border-2 border-wine bg-gold-soft/40 shadow-md'
          : 'border-gold/40 bg-white hover:border-gold'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-serif text-[14px] font-medium text-wine-dark">{opt.label}</span>
        <span className="rounded bg-emerald-600/90 px-1.5 py-0.5 text-[10px] text-cream">包邮</span>
      </div>
      {opt.sub && (
        <div className="mt-1.5 space-y-0.5 text-[11px] text-wine-dark/70">
          {opt.sub.split('\n').map((l, i) => (
            <div key={i} className={i > 0 ? 'flex items-center gap-1 text-emerald-600' : ''}>
              {i > 0 && <Check size={10} />}
              {l}
            </div>
          ))}
        </div>
      )}
      {active && <CornerCheck />}
    </button>
  );
}

// ─── 主组件 ──────────────────────────────────────────────────
export default function Customization() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [categories, setCategories] = useState<CustomizationCategory[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/storefront');
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        if (!cancelled) {
          setCategories(data.categories ?? []);
          setAllProducts(data.products ?? []);
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const getProductsByCategory = (slug: string) => allProducts.filter((p) => p.category === slug);
  const getProduct = (slug: string) => allProducts.find((p) => p.slug === slug);

  // 选择流程状态
  const [stage, setStage] = useState<'category' | 'product' | 'config' | 'done'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [picked, setPicked] = useState<Record<string, string>>({});

  // 当前选中的产品及其配置步骤
  const selectedProduct = selectedProductSlug ? getProduct(selectedProductSlug) : null;
  const steps = selectedProduct ? getStepsForProduct(selectedProduct) : [];
  const allDone = steps.length > 0 && steps.every((s) => picked[s.key]);

  // 已完成的步骤数
  const completedSteps = steps.filter((s) => picked[s.key]).length;
  // 当前正在进行的步骤索引
  const currentStepIndex = Math.min(completedSteps, steps.length - 1);

  const totalAddOn = useMemo(
    () =>
      steps.reduce((sum, s) => {
        const opt = s.options.find((o) => o.id === picked[s.key]);
        return sum + (opt?.price ?? 0);
      }, 0),
    [picked, steps]
  );

  const finalPrice = selectedProduct ? selectedProduct.price + totalAddOn : 0;

  // 处理分类选择
  const handleCategorySelect = (slug: string, name: string) => {
    setSelectedCategory(slug);
    setSelectedProductSlug(null);
    setStage('product');
  };

  // 处理产品选择
  const handleProductSelect = (productSlug: string) => {
    setSelectedProductSlug(productSlug);
    setPicked({}); // 重置配置选择
    const p = getProduct(productSlug);
    if (p) {
      const pSteps = getStepsForProduct(p);
      if (pSteps.length > 0) {
        setStage('config');
      } else {
        setStage('done');
      }
    }
  };

  // 处理配置选项选择
  const handleConfigSelect = (opt: ConfigOption, step: ConfigStep) => {
    setPicked((prev) => ({ ...prev, [step.key]: opt.id }));

    // 检查是否完成所有步骤
    setTimeout(() => {
      const newPicked = { ...picked, [step.key]: opt.id };
      const done = steps.every((s) => newPicked[s.key]);
      if (done) {
        setStage('done');
      }
    }, 200);
  };

  // 重置
  const handleReset = () => {
    setStage('category');
    setSelectedCategory(null);
    setSelectedProductSlug(null);
    setPicked({});
    setShowSuccess(false);
  };

  // 添加到购物车
  const addToCart = () => {
    if (!selectedProduct) return;

    const configuration = steps.reduce((config, s) => {
      const opt = s.options.find((o) => o.id === picked[s.key]);
      if (opt) {
        config[s.key] = {
          label: opt.label,
          price: opt.price ?? 0,
          id: opt.id,
        };
      }
      return config;
    }, {} as Record<string, { label: string; price: number; id: string }>);

    const cartItem = {
      slug: selectedProduct.slug,
      qty: 1,
      configKey: JSON.stringify(configuration),
      configuration,
      price: finalPrice,
      productName: selectedProduct.name,
      image: selectedProduct.images[0],
      color: selectedProduct.color,
    };

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProducts = JSON.parse(localStorage.getItem('cartProducts') || '[]');
    const configKey = cartItem.configKey;
    const existingIndex = existingCart.findIndex(
      (item: any) => item.slug === selectedProduct.slug && item.configKey === configKey
    );

    if (existingIndex >= 0) {
      existingCart[existingIndex].qty += 1;
      existingProducts[existingIndex].qty += 1;
    } else {
      existingCart.push(cartItem);
      existingProducts.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    localStorage.setItem('cartProducts', JSON.stringify(existingProducts));
    window.dispatchEvent(new Event('cart-updated'));

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsOpen(false);
    }, 2000);
  };

  const contentRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [stage, completedSteps, isOpen]);

  // 分类和产品数据
  const categoryProducts = selectedCategory ? getProductsByCategory(selectedCategory) : [];

  return (
    <>
      {/* 悬浮客服按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-wine px-5 py-3 text-cream shadow-lg transition-all hover:bg-wine/90 ${
          isOpen ? 'hidden' : 'flex'
        }`}
      >
        <MessageCircle size={20} />
        <span className="font-medium">在线咨询</span>
      </button>

      {/* 客服对话框 */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[380px] overflow-hidden rounded-2xl border border-gold/40 bg-cream text-left shadow-xl transition-all duration-300 ${
          isOpen ? 'h-[600px] opacity-100' : 'h-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-gold/30 bg-wine/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-wine text-gold">
              <ShoppingBag size={16} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-wine-dark">ZHONGQUE 麻将助手</p>
              <p className="flex items-center gap-1 text-[11px] text-green-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span>
                在线
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-wine-dark/60 hover:bg-wine/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* 对话内容 */}
        <div
          ref={contentRef}
          className="h-[calc(100%-140px)] overflow-y-auto px-4 py-3 space-y-3"
        >
          {/* 阶段一：选择分类 */}
          {stage === 'category' && (
            <>
              <BotBubble>
                您好，我是 <span className="font-medium text-wine">ZHONGQUE 麻将助手</span>，
                请先选择您想要的麻将机类型
              </BotBubble>

              {dataLoading && (
                <div className="grid grid-cols-2 gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] w-full animate-pulse rounded-lg border border-gold/30 bg-gold/10"
                    />
                  ))}
                </div>
              )}

              {!dataLoading && categories.length === 0 && (
                <div className="rounded-lg border border-gold/30 bg-white px-3 py-4 text-center text-[12px] text-wine-dark/70">
                  暂无可选商品分类，请稍后再试。
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategorySelect(cat.slug, cat.name)}
                    className="group relative overflow-hidden rounded-lg border border-gold/40 bg-white text-left transition hover:border-wine hover:shadow-md"
                  >
                    {/* 分类图片 */}
                    <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-[#e8dcc4] to-[#f5ead8] overflow-hidden">
                      {(() => {
                        const prods = getProductsByCategory(cat.slug);
                        const firstProd = prods[0];
                        if (firstProd?.images?.[0]) {
                          return (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={firstProd.images[0]}
                              alt={cat.name}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          );
                        }
                        return (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag size={24} className="text-wine/30" />
                          </div>
                        );
                      })()}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-[12px] font-medium text-white">{cat.name}</p>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-[11px] text-wine-dark/60 line-clamp-2">
                        {cat.desc.slice(0, 40)}...
                      </p>
                      <p className="mt-1 text-[11px] text-wine">
                        {getProductsByCategory(cat.slug).length > 0
                          ? `${getProductsByCategory(cat.slug).length} 款可选`
                          : '敬请期待'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* 阶段二：选择具体产品 */}
          {stage === 'product' && selectedCategory && (
            <>
              <BotBubble>
                您选择了 <span className="font-medium text-wine">
                  {categories.find(c => c.slug === selectedCategory)?.name}
                </span>，请选择具体的产品型号
              </BotBubble>

              <div className="space-y-2">
                {categoryProducts.map((p) => (
                  <button
                    key={p.slug}
                    onClick={() => handleProductSelect(p.slug)}
                    className="group flex w-full items-center gap-3 rounded-lg border border-gold/40 bg-white p-2 text-left transition hover:border-wine hover:shadow-md"
                  >
                    {/* 产品图片 */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-cream2 to-cream">
                      {p.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="font-serif text-[16px] text-wine/30">{p.name.slice(0, 1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-[13px] font-medium text-wine-dark line-clamp-1">
                        {p.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-wine-dark/60 line-clamp-1">
                        {p.shortDesc}
                      </p>
                      <p className="mt-1 font-serif text-[15px] text-wine">
                        ${p.price}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleReset}
                className="text-[12px] text-wine/60 hover:text-wine underline"
              >
                重新选择
              </button>
            </>
          )}

          {/* 阶段三：产品配置 */}
          {stage === 'config' && selectedProduct && steps.length > 0 && (
            <>
              <BotBubble>
                您选择了 <span className="font-medium text-wine">{selectedProduct.name}</span>，
                接下来引导您完成配置
              </BotBubble>

              {/* 进度条 */}
              <div className="flex items-center gap-2">
                <div className="h-1 flex-1 rounded-full bg-gold/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-wine transition-all duration-300"
                    style={{ width: `${(completedSteps / steps.length) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] text-wine-dark/60 shrink-0">
                  {completedSteps}/{steps.length}
                </span>
              </div>

              {/* 逐个显示步骤 */}
              {steps.slice(0, currentStepIndex + 1).map((s, displayIdx) => {
                const activeId = picked[s.key];
                const activeOpt = s.options.find((o) => o.id === activeId);
                const isCurrent = displayIdx === currentStepIndex;

                return (
                  <div key={s.key}>
                    <BotBubble>
                      {s.prompt.replace(s.highlight, '')}
                      <span className="font-medium text-wine">{s.highlight}</span>。
                      {s.desc && (
                        <div className="mt-0.5 text-[11px] text-wine-dark/60">{s.desc}</div>
                      )}
                    </BotBubble>

                    {isCurrent && !activeId && (
                      <div>
                        {s.layout === 'swatch' && (
                          <div className="flex flex-wrap gap-2">
                            {s.options.map((o) => (
                              <SwatchOption
                                key={o.id}
                                opt={o}
                                active={false}
                                onClick={() => handleConfigSelect(o, s)}
                              />
                            ))}
                          </div>
                        )}
                        {s.layout === 'grid' && (
                          <>
                            <div className="grid grid-cols-4 gap-2">
                              {s.options.map((o) => (
                                <GridOption
                                  key={o.id}
                                  opt={o}
                                  active={false}
                                  onClick={() => handleConfigSelect(o, s)}
                                />
                              ))}
                            </div>
                            <div className="mt-2 flex items-center gap-1 text-[11px] text-wine-dark/60">
                              <HelpCircle size={10} />
                              <a className="text-gold hover:text-wine" href="/blog">查看尺寸指南</a>
                            </div>
                          </>
                        )}
                        {s.layout === 'list' && (
                          <div className="space-y-2">
                            {s.options.map((o) => (
                              <ListOption
                                key={o.id}
                                opt={o}
                                active={false}
                                onClick={() => handleConfigSelect(o, s)}
                              />
                            ))}
                          </div>
                        )}
                        {s.layout === 'cards' && (
                          <div className={`grid gap-2 ${s.options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            {s.options.map((o) => (
                              <CardOption
                                key={o.id}
                                opt={o}
                                active={false}
                                onClick={() => handleConfigSelect(o, s)}
                              />
                            ))}
                          </div>
                        )}
                        {s.layout === 'shipping' && (
                          <div className="space-y-2">
                            {s.options.map((o) => (
                              <ShippingOption
                                key={o.id}
                                opt={o}
                                active={false}
                                onClick={() => handleConfigSelect(o, s)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeOpt && (
                      <UserBubble
                        text={s.layout === 'shipping' ? `${activeOpt.label}（包邮）` : activeOpt.label}
                      />
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* 阶段四：配置完成 */}
          {stage === 'done' && selectedProduct && (
            <>
              <BotBubble>
                太棒了！您的专属麻将机已配置完成！
              </BotBubble>

              <div className="rounded-lg border border-gold/40 bg-white overflow-hidden">
                <div className="flex items-center gap-2 border-b border-gold/30 bg-cream2/60 px-3 py-2">
                  <ClipboardList size={14} className="text-wine" />
                  <span className="font-serif text-[13px] font-medium text-wine-dark">配置清单</span>
                </div>
                <div className="px-3 py-2 space-y-1.5 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-wine-dark/70">产品型号</span>
                    <span className="font-medium text-wine-dark">{selectedProduct.name}</span>
                  </div>
                  {steps.map((s) => {
                    const opt = s.options.find((o) => o.id === picked[s.key]);
                    if (!opt) return null;
                    const free = !opt.price;
                    return (
                      <div key={s.key} className="flex justify-between">
                        <span className="text-wine-dark/70">{STEP_LABEL[s.key] ?? s.key}</span>
                        <span>
                          <span className="text-wine-dark">{opt.label}</span>
                          <span className={`ml-1 ${free ? 'text-emerald-600' : 'text-wine'}`}>
                            ({free ? '免费' : `+$${opt.price}`})
                          </span>
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between border-t border-gold/20 pt-2 mt-2">
                    <span className="font-medium text-wine-dark">配置价格</span>
                    <span className="font-serif text-[18px] font-medium text-wine">${finalPrice}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={addToCart}
                className="btn-wine w-full justify-center text-[13px]"
              >
                <ShoppingBag size={14} /> 加入购物车
              </button>

              {showSuccess && (
                <div className="rounded-md bg-emerald-100 p-2 text-center text-[12px] text-emerald-700">
                  已加入购物车！
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-gold/50 bg-white px-3 py-2 text-[12px] text-wine-dark hover:border-wine">
                  <Heart size={12} /> 收藏
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-gold/50 bg-white px-3 py-2 text-[12px] text-wine-dark hover:border-wine"
                >
                  <RotateCcw size={12} /> 重新配置
                </button>
              </div>
            </>
          )}
        </div>

        {/* 底部输入框 */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gold/30 bg-cream/95 px-4 py-2">
          <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-white px-3 py-1.5 shadow-sm">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="输入消息..."
              className="flex-1 bg-transparent text-[12px] text-wine-dark placeholder:text-wine-dark/40 focus:outline-none"
            />
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-wine text-cream hover:bg-wine/90"
              aria-label="发送"
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
