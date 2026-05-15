'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Check,
  Heart,
  RotateCcw,
  Send,
  ClipboardList,
  HelpCircle,
  Star,
} from 'lucide-react';
import type { ConfigStep, ConfigOption } from '@/lib/configurator';
import { STEP_LABEL } from '@/lib/configurator';
import type { Product } from '@/lib/products';

// ─── 头像与气泡 ──────────────────────────────────────────────
function BotAvatar() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/60 bg-cream text-wine">
      <ShoppingBag size={16} />
    </div>
  );
}

function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <BotAvatar />
      <div className="relative max-w-[520px] rounded-2xl border border-gold/40 bg-white px-5 py-3 text-[14px] leading-relaxed text-wine-dark shadow-card">
        <span className="absolute -left-[7px] top-4 h-3 w-3 rotate-45 border-b border-l border-gold/40 bg-white" />
        {children}
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="relative rounded-lg bg-wine-deeper px-4 py-1.5 text-[13px] text-cream shadow-md">
        <span className="absolute -right-[6px] top-3 h-3 w-3 rotate-45 bg-wine-deeper" />
        {text}
      </div>
    </div>
  );
}

// ─── 选项控件 ────────────────────────────────────────────────
function CornerCheck() {
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-wine text-cream shadow">
      <Check size={12} strokeWidth={3} />
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
      className={`relative inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 transition ${
        active ? 'border-2 border-wine shadow-md' : 'border-gold/40 hover:border-gold'
      }`}
    >
      <span
        className="h-6 w-6 rounded-full border border-black/10"
        style={{ background: opt.swatch }}
      />
      <span className="text-[13px] text-wine-dark">{opt.label}</span>
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
      className={`relative rounded-md border bg-white px-4 py-3 text-center transition ${
        active ? 'border-2 border-wine shadow-md' : 'border-gold/40 hover:border-gold'
      }`}
    >
      <div className="font-serif text-[20px] font-medium text-wine-dark">
        {opt.label}
      </div>
      <div className={`mt-1 text-[12px] ${free ? 'text-emerald-600' : 'text-wine'}`}>
        {free ? (
          '免费'
        ) : (
          <>
            {opt.origPrice && (
              <span className="mr-1 text-wine-dark/40 line-through">
                +${opt.origPrice}
              </span>
            )}
            <span>+${opt.price}</span>
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
      className={`relative flex w-full items-center justify-between rounded-md border px-5 py-3 text-left transition ${
        active
          ? 'border-2 border-wine bg-gold-soft/40 shadow-md'
          : 'border-gold/40 bg-white hover:border-gold'
      }`}
    >
      <div>
        <div className="font-serif text-[18px] font-medium text-wine-dark">
          {opt.label}
        </div>
        {opt.sub && <div className="mt-1 text-[12px] text-wine-dark/60">{opt.sub}</div>}
      </div>
      <div className="flex items-center gap-2">
        {opt.badge === 'common' && (
          <span className="rounded bg-wine px-2 py-0.5 text-[11px] text-cream">常用</span>
        )}
        <span className={`text-[13px] ${free ? 'text-emerald-600' : 'text-wine'}`}>
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
            <div className="flex h-full w-full items-center justify-center font-serif text-[18px] text-cream/90 mix-blend-overlay">
              {opt.label}
            </div>
          </div>
        )}
        {opt.badge === 'recommend' && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-gold px-2 py-0.5 text-[11px] text-wine-deeper">
            <Star size={10} fill="#5A4080" strokeWidth={0} /> 推荐
          </span>
        )}
      </div>
      <div className="px-4 py-3 text-center">
        <div className="font-serif text-[16px] font-medium text-wine-dark">
          {opt.label}
        </div>
        {opt.sub && (
          <div className="mt-1 line-clamp-2 text-[12px] text-wine-dark/60">
            {opt.sub.split('\n')[0]}
          </div>
        )}
        <div className={`mt-2 text-[13px] ${free ? 'text-emerald-600' : 'text-wine'}`}>
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
      className={`relative flex w-full flex-col rounded-lg border px-5 py-4 text-left transition ${
        active
          ? 'border-2 border-wine bg-gold-soft/40 shadow-md'
          : 'border-gold/40 bg-white hover:border-gold'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-serif text-[16px] font-medium text-wine-dark">
          {opt.label}
        </span>
        <span className="rounded bg-emerald-600/90 px-2 py-0.5 text-[11px] text-cream">
          包邮
        </span>
      </div>
      {opt.sub && (
        <div className="mt-2 space-y-1 text-[12px] text-wine-dark/70">
          {opt.sub.split('\n').map((l, i) => (
            <div key={i} className={i > 0 ? 'flex items-center gap-1 text-emerald-600' : ''}>
              {i > 0 && <Check size={12} />}
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
export default function ProductConfigurator({
  product,
  steps,
}: {
  product: Product;
  steps: ConfigStep[];
}) {
  const router = useRouter();
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [stage, setStage] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const allDone = steps.length > 0 && steps.every((s) => picked[s.key]);

  const totalAddOn = useMemo(
    () =>
      steps.reduce((sum, s) => {
        const opt = s.options.find((o) => o.id === picked[s.key]);
        return sum + (opt?.price ?? 0);
      }, 0),
    [picked, steps]
  );

  const finalPrice = product.price + totalAddOn;

  // Build configuration details for cart
  const configuration = useMemo(() => {
    return steps.reduce((config, s) => {
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
  }, [picked, steps]);

  const addToCart = () => {
    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProducts = JSON.parse(localStorage.getItem('cartProducts') || '[]');

    // Check if this exact configuration already exists
    const configKey = JSON.stringify(configuration);
    const existingIndex = existingCart.findIndex(
      (item: any) => item.slug === product.slug && item.configKey === configKey
    );

    const cartItem = {
      slug: product.slug,
      qty: 1,
      configKey,
      configuration,
      price: finalPrice,
      productName: product.name,
      image: product.images[0],
      color: product.color,
    };

    if (existingIndex >= 0) {
      // Update quantity if same configuration exists
      existingCart[existingIndex].qty += 1;
      existingProducts[existingIndex].qty += 1;
    } else {
      // Add new item
      existingCart.push(cartItem);
      existingProducts.push(cartItem);
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    localStorage.setItem('cartProducts', JSON.stringify(existingProducts));

    // Dispatch event to update cart count in header
    window.dispatchEvent(new Event('cart-updated'));

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const select = (stepIdx: number, opt: ConfigOption) => {
    const step = steps[stepIdx];
    setPicked((p) => ({ ...p, [step.key]: opt.id }));
    setStage((s) => Math.max(s, stepIdx + 1));
  };

  const reset = () => {
    setPicked({});
    setStage(0);
  };

  const renderPrompt = (s: ConfigStep) => {
    const idx = s.prompt.indexOf(s.highlight);
    if (idx < 0) return s.prompt + '。';
    return (
      <>
        {s.prompt.slice(0, idx)}
        <span className="font-medium text-wine">{s.highlight}</span>
        {s.prompt.slice(idx + s.highlight.length)}。
      </>
    );
  };

  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [stage, allDone]);

  return (
    <div className="mx-auto max-w-[760px] px-4 pb-24 pt-2">
      {/* 进度点 */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <span
            key={s.key}
            className={`h-2 rounded-full transition-all ${
              i < stage ? 'w-2 bg-gold' : i === stage ? 'w-6 bg-gold' : 'w-2 bg-gold/30'
            }`}
          />
        ))}
      </div>

      <div className="space-y-6">
        <BotBubble>
          您好，我是 <span className="font-medium text-wine">ZHONGQUE 麻将助手</span>
        </BotBubble>
        <BotBubble>
          接下来我会引导您完成麻将机个性化配置，只需选择几个简单的问题对应的选项，
          就能打造一台属于您的麻将机！
          <div className="mt-1 text-[12px] text-wine-dark/60">（可随时接入人工客服）</div>
        </BotBubble>

        {steps.map((s, i) => {
          if (i > stage) return null;
          const activeId = picked[s.key];
          const activeOpt = s.options.find((o) => o.id === activeId);
          return (
            <div key={s.key} className="space-y-4">
              <BotBubble>
                {renderPrompt(s)}
                {s.desc && (
                  <div className="mt-1 text-[12px] text-wine-dark/60">{s.desc}</div>
                )}
              </BotBubble>

              <div className="ml-12">
                {s.layout === 'swatch' && (
                  <div className="flex flex-wrap gap-3">
                    {s.options.map((o) => (
                      <SwatchOption
                        key={o.id}
                        opt={o}
                        active={activeId === o.id}
                        onClick={() => select(i, o)}
                      />
                    ))}
                  </div>
                )}
                {s.layout === 'grid' && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      {s.options.map((o) => (
                        <GridOption
                          key={o.id}
                          opt={o}
                          active={activeId === o.id}
                          onClick={() => select(i, o)}
                        />
                      ))}
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1 text-[12px] text-wine-dark/60">
                      <HelpCircle size={12} /> 不知道麻将牌尺寸怎么选？
                      <a className="text-gold hover:text-wine" href="/blog">
                        查看这篇指南
                      </a>
                    </div>
                  </>
                )}
                {s.layout === 'list' && (
                  <div className="space-y-2">
                    {s.options.map((o) => (
                      <ListOption
                        key={o.id}
                        opt={o}
                        active={activeId === o.id}
                        onClick={() => select(i, o)}
                      />
                    ))}
                  </div>
                )}
                {s.layout === 'cards' && (
                  <div
                    className={`grid gap-3 ${
                      s.options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                    }`}
                  >
                    {s.options.map((o) => (
                      <CardOption
                        key={o.id}
                        opt={o}
                        active={activeId === o.id}
                        onClick={() => select(i, o)}
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
                        active={activeId === o.id}
                        onClick={() => select(i, o)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {activeOpt && (
                <UserBubble
                  text={s.layout === 'shipping' ? `${activeOpt.label}（包邮）` : activeOpt.label}
                />
              )}
            </div>
          );
        })}

        {allDone && (
          <>
            <BotBubble>
              太好了！您的专属麻将机已配置完成，点击下方按钮带它回家！
            </BotBubble>

            <div className="ml-12">
              <div className="card-gold overflow-hidden">
                <div className="flex items-center gap-2 border-b border-gold/30 bg-cream2/60 px-5 py-3">
                  <ClipboardList size={16} className="text-wine" />
                  <span className="font-serif text-[16px] font-medium text-wine-dark">
                    配置清单
                  </span>
                </div>
                <table className="w-full text-[13px]">
                  <tbody>
                    <SummaryRow label="产品型号" value={product.name} />
                    <SummaryRow label="产品类型" value={product.categoryName || '-'} />
                    {steps.map((s) => {
                      const opt = s.options.find((o) => o.id === picked[s.key]);
                      if (!opt) return null;
                      const free = !opt.price;
                      return (
                        <SummaryRow
                          key={s.key}
                          label={STEP_LABEL[s.key] ?? s.key}
                          value={
                            <>
                              <span className="text-wine-dark">{opt.label}</span>{' '}
                              <span className={free ? 'text-emerald-600' : 'text-wine'}>
                                ({free ? '免费' : `+$${opt.price}`})
                              </span>
                            </>
                          }
                        />
                      );
                    })}
                    <tr>
                      <td className="px-5 py-4 text-[14px] text-wine-dark/80">配置价格</td>
                      <td className="px-5 py-4 text-right font-serif text-[24px] font-medium text-wine">
                        ${finalPrice}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button
                onClick={addToCart}
                className="btn-wine mt-5 w-full justify-center text-[15px]"
              >
                <ShoppingBag size={18} /> 加入购物车
              </button>

              {showSuccess && (
                <div className="mt-3 rounded-md bg-emerald-100 p-3 text-center text-[13px] text-emerald-700">
                  已加入购物车！<a href="/cart" className="underline">查看购物车</a>
                </div>
              )}

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button className="inline-flex items-center justify-center gap-2 rounded-md border border-gold/50 bg-white px-4 py-2.5 text-[13px] text-wine-dark hover:border-wine hover:text-wine">
                  <Heart size={14} /> 收藏
                </button>
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-gold/50 bg-white px-4 py-2.5 text-[13px] text-wine-dark hover:border-wine hover:text-wine"
                >
                  <RotateCcw size={14} /> 重新配置
                </button>
              </div>

              <p className="mt-3 text-center text-[12px] text-wine-dark/60">
                用户已连接人工客服
              </p>
            </div>

            <UserBubble text="买麻将机  02:41" />
          </>
        )}

        <div ref={endRef} />
      </div>

      <div className="sticky bottom-4 mt-10 ml-12">
        <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-white px-4 py-2 shadow-card">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="输入消息给人工客服..."
            className="flex-1 bg-transparent text-[13px] text-wine-dark placeholder:text-wine-dark/40 focus:outline-none"
          />
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-wine text-cream"
            aria-label="发送"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <tr className="border-b border-gold/20 last:border-0">
      <td className="w-32 px-5 py-2.5 text-wine-dark/70">{label}</td>
      <td className="px-5 py-2.5 text-right">{value}</td>
    </tr>
  );
}
