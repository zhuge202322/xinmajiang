// 产品图：优先使用真实图片 URL，缺失时退回 SVG 占位
export default function ProductImage({
  src,
  color,
  label,
  variant = 0,
}: {
  src?: string;
  color?: string;
  label: string;
  variant?: number;
}) {
  if (src) {
    return (
      // 用普通 <img> 即可，免去 next/image 的远程域名配置
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={label}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    );
  }

  const id = `pi-${label}-${variant}`.replace(/\s+/g, '');
  const fill = color || '#7B5DA8';
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5ead8" />
          <stop offset="100%" stopColor="#e8dcc4" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#${id})`} />
      <rect x="120" y="100" width="160" height="220" rx="6" fill={fill} />
      <rect x="135" y="115" width="130" height="170" rx="3" fill="#fff" opacity="0.85" />
      <rect x="135" y="290" width="130" height="20" rx="2" fill="#222" opacity="0.6" />
      <circle cx="160" cy="335" r="12" fill="#222" />
      <circle cx="240" cy="335" r="12" fill="#222" />
      {variant > 0 && (
        <text x="370" y="30" textAnchor="end" fill="#7b5da8" opacity="0.4" fontSize="14">
          视图 {variant + 1}
        </text>
      )}
      <text
        x="200"
        y="380"
        textAnchor="middle"
        fill="#7b5da8"
        opacity="0.5"
        fontSize="13"
        fontFamily="sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}
