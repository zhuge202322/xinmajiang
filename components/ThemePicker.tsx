'use client';

import { Palette, RotateCcw, X, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// 默认色（玫瑰粉）
const DEFAULTS = {
  wine: '#C97A8E',
  'wine-dark': '#A65A6F',
  'wine-deeper': '#7E3F52',
};

const STORAGE_KEY = 'luundy-theme-v1';

// 预设方案
const PRESETS: { name: string; colors: Record<string, string> }[] = [
  { name: '经典酒红', colors: { wine: '#8B0000', 'wine-dark': '#771D1D', 'wine-deeper': '#5C1010' } },
  { name: '淡紫雅致', colors: { wine: '#9B7EBD', 'wine-dark': '#7B5DA8', 'wine-deeper': '#5A4080' } },
  { name: '森林墨绿', colors: { wine: '#4A8D6D', 'wine-dark': '#2F6B50', 'wine-deeper': '#1F4D38' } },
  { name: '海军深蓝', colors: { wine: '#3E6FA8', 'wine-dark': '#2A4F7E', 'wine-deeper': '#1B3759' } },
  { name: '咖啡金棕', colors: { wine: '#A07A4F', 'wine-dark': '#7E5A36', 'wine-deeper': '#5A3F23' } },
  { name: '玫瑰粉调', colors: { wine: '#C97A8E', 'wine-dark': '#A65A6F', 'wine-deeper': '#7E3F52' } },
];

// hex → "R G B"
function hexToRgbTriplet(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

function applyColors(colors: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(colors).forEach(([k, v]) => {
    root.style.setProperty(`--${k}`, hexToRgbTriplet(v));
  });
}

export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [colors, setColors] = useState<Record<string, string>>(DEFAULTS);
  const loaded = useRef(false);

  // 启动时从 localStorage 恢复
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setColors({ ...DEFAULTS, ...saved });
        applyColors({ ...DEFAULTS, ...saved });
      }
    } catch {}
  }, []);

  const update = (key: string, value: string) => {
    const next = { ...colors, [key]: value };
    setColors(next);
    applyColors(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const usePreset = (preset: Record<string, string>) => {
    setColors(preset);
    applyColors(preset);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preset));
    } catch {}
  };

  const reset = () => {
    setColors(DEFAULTS);
    applyColors(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const labels: Record<string, string> = {
    wine: '主色（强调字 / 链接 / 价格）',
    'wine-dark': '中色（按钮 hover / 描边）',
    'wine-deeper': '深色（顶栏 / 底栏 / 主按钮 / 深底纹）',
  };

  return (
    <>
      {/* 入口圆按钮 */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[100] flex h-12 w-12 items-center justify-center rounded-full bg-wine-deeper text-cream shadow-xl transition hover:scale-105"
          aria-label="主题颜色"
          title="主题颜色"
        >
          <Palette size={20} />
        </button>
      )}

      {/* 面板 */}
      {open && (
        <div className="fixed bottom-5 right-5 z-[100] w-[320px] rounded-xl border border-gold/40 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gold/30 bg-cream2/60 px-4 py-3">
            <div className="flex items-center gap-2 font-serif text-[15px] font-medium text-wine-dark">
              <Palette size={16} /> 主题颜色调节
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-wine-dark/60 hover:text-wine"
              aria-label="关闭"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3 p-4">
            {/* 预设 */}
            <div>
              <div className="mb-2 text-[12px] text-wine-dark/60">快速预设</div>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => {
                  const active = JSON.stringify(p.colors) === JSON.stringify(colors);
                  return (
                    <button
                      key={p.name}
                      onClick={() => usePreset(p.colors)}
                      className={`relative flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition ${
                        active
                          ? 'border-wine bg-cream2 text-wine'
                          : 'border-gold/40 hover:border-gold text-wine-dark/80'
                      }`}
                    >
                      <span className="flex">
                        <span
                          className="h-3 w-3 rounded-l-full"
                          style={{ background: p.colors['wine-deeper'] }}
                        />
                        <span
                          className="h-3 w-3"
                          style={{ background: p.colors['wine-dark'] }}
                        />
                        <span
                          className="h-3 w-3 rounded-r-full"
                          style={{ background: p.colors.wine }}
                        />
                      </span>
                      {p.name}
                      {active && <Check size={11} className="text-wine" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="my-2 border-t border-gold/20" />

            {/* 单色精调 */}
            <div className="space-y-3">
              {(['wine-deeper', 'wine-dark', 'wine'] as const).map((k) => (
                <label key={k} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colors[k]}
                    onChange={(e) => update(k, e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-gold/40 bg-transparent"
                  />
                  <div className="flex-1">
                    <div className="text-[12px] text-wine-dark/80">{labels[k]}</div>
                    <div className="font-mono text-[11px] text-wine-dark/50">
                      {colors[k].toUpperCase()}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="my-2 border-t border-gold/20" />

            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md border border-gold/40 px-3 py-1.5 text-[12px] text-wine-dark hover:border-wine hover:text-wine"
            >
              <RotateCcw size={12} /> 重置为默认
            </button>

            <p className="pt-1 text-[11px] text-wine-dark/50">
              修改会保存到浏览器，下次访问自动应用。
            </p>
          </div>
        </div>
      )}
    </>
  );
}
