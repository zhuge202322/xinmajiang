'use client';

import { LayoutGrid, MapPin, Settings, ChevronLeft, ChevronRight, Video, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const slides = [
  '/img/hero1.jpg',
  '/img/hero2.jpg',
  '/img/hero3.jpg',
  '/img/hero4.jpg',
];

const INTERVAL = 5500; // ms

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 自动轮播
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  const go = (i: number) => setIdx((i + slides.length) % slides.length);

  return (
    <section
      className="relative h-[calc(100vh-60px)] min-h-[560px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 轮播底图层（淡入淡出） */}
      <div className="absolute inset-0">
        {slides.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={`hero-${i + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
              i === idx ? 'opacity-100' : 'opacity-0'
            }`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>

      {/* 暗化叠层，提升文字可读性 */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* 装饰圆环 */}
      <div className="pointer-events-none absolute left-12 top-16 h-44 w-44 rounded-full border border-gold/40" />
      <div className="pointer-events-none absolute left-[120px] top-[110px] h-px w-44 rotate-45 bg-gold/40" />

      {/* 文案层（保留原内容） */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1280px] items-center px-8">
        <div className="flex max-w-[640px] flex-col">
          <span className="pill-decor-dark mb-6 self-start">
            匠心之造 · 品质传承
          </span>

          <h1 className="font-serif text-[56px] font-medium leading-[1.15] text-cream drop-shadow-lg">
            ZHONGQUE，重新定义
            <br />
            海外华人的
            <span className="text-gradient">麻将体验</span>
          </h1>

          <p className="mt-6 text-[16px] text-cream/90 drop-shadow">
            源头工厂直供 <span className="mx-2 text-gold">|</span> 支持全美派送
            <span className="mx-2 text-gold">|</span> 仓库现货自提
          </p>

          <div className="mt-10 grid w-full max-w-[560px] grid-cols-2 gap-3">
            <Link href="/shop" className="btn-wine flex items-center justify-center px-4 py-3">
              <LayoutGrid size={18} /> 浏览全系产品
            </Link>
            <Link href="/dealer-locator" className="btn-wine-outline flex items-center justify-center px-4 py-3">
              <MapPin size={18} /> 附近提货/经销商
            </Link>
            <button className="btn-gold flex items-center justify-center px-4 py-3">
              <Settings size={18} /> 快速配置麻将机
            </button>
            <button
              onClick={() => setVideoOpen(true)}
              className="btn-wine-outline flex items-center justify-center px-4 py-3"
            >
              <Video size={18} /> 查看视频
            </button>
          </div>
        </div>
      </div>

      {/* 左右切换箭头 */}
      <button
        onClick={() => go(idx - 1)}
        aria-label="上一张"
        className="group absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 p-2 text-white backdrop-blur transition hover:bg-black/50 md:flex"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={() => go(idx + 1)}
        aria-label="下一张"
        className="group absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 p-2 text-white backdrop-blur transition hover:bg-black/50 md:flex"
      >
        <ChevronRight size={22} />
      </button>

      {/* 指示点 */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`跳到第 ${i + 1} 张`}
            className={`h-2 rounded-full transition-all ${
              i === idx ? 'w-8 bg-gold' : 'w-2 bg-white/55 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* 视频抽屉（从右侧滑出） */}
      {videoOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setVideoOpen(false)}
          />
          <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[640px] flex-col bg-black shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <span className="text-sm font-medium text-white/80">视频介绍</span>
              <button
                onClick={() => setVideoOpen(false)}
                aria-label="关闭"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white/50 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <div className="relative flex-1">
              <video
                ref={videoRef}
                src="/img/hero.mp4"
                controls
                autoPlay
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
