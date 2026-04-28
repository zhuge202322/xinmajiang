# Luundy Next.js 性能对比 POC

参照 `https://www.luundy.com/`（WordPress + WooCommerce）的页面布局，使用 **Next.js 14 (App Router) + TypeScript + Tailwind CSS** 重构首页，用于与原站做 Lighthouse / WebPageTest 性能对比。

## 设计还原说明

- **颜色 / 字体 / 排版 / 区块结构** 与原站一致：
  - 背景 `#FDF8F0`，主红 `#8B0000`，金色 `#D4AF37`
  - 中文字体使用 `Noto Sans SC` + `Noto Serif SC`
  - 菱格金线背景纹理（CSS 内联 SVG，零额外请求）
- **图片资源使用 SVG 占位图**（同尺寸、同位置、同纵横比），避免复制原站版权素材。客户上线时只需将 `<ProductPlaceholder>` 等组件替换为 `next/image` + 实际素材即可。

## 性能优化点

1. **App Router + RSC**：默认 Server Components，零运行时 JS。
2. **`next/font`**：`Noto Sans SC / Serif SC` 自托管 + 子集化，首屏无字体闪烁。
3. **CSS 内联 SVG 背景**：菱格底纹无图片请求。
4. **`next/image`**（接入真实素材后）：自动 AVIF/WebP、尺寸协商、懒加载。
5. **静态化**：首页 100% SSG，可直接走 CDN 边缘节点。
6. **Tailwind purge**：仅打包用到的样式，CSS < 20KB。

## 启动

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # 生产构建
```

## 性能对比建议

```bash
# 1. 原站
npx lighthouse https://www.luundy.com/ --only-categories=performance --view

# 2. 本地 Next.js 生产版
npm run build && npm start
npx lighthouse http://localhost:3000 --only-categories=performance --view
```

或部署到 Vercel 后用 WebPageTest 做多地域对比测试。

## 后续接入真实素材

1. 将原站的产品图（客户授权）放入 `public/images/products/`
2. 在 `components/ProductGrid.tsx` 中将 `<ProductPlaceholder>` 替换为：
   ```tsx
   import Image from 'next/image';
   <Image src="/images/products/folding-4mouth.webp" alt={p.name} fill priority={false} />
   ```
3. Hero 大图同理替换为 `<Image>`。

## 目录结构

```
app/
  layout.tsx       根布局 + 字体注入
  page.tsx         首页装配
  globals.css      Tailwind + 自定义 utility
components/
  Header.tsx       顶部导航
  Hero.tsx         首屏
  FeatureBar.tsx   4 项卖点
  Coupons.tsx      新客优惠码
  ProductGrid.tsx  产品网格
  Shipping.tsx     配送方式
  Dealers.tsx      经销商地图
  Customization.tsx 在线配置入口
  Footer.tsx       页脚
tailwind.config.ts
next.config.mjs
```
