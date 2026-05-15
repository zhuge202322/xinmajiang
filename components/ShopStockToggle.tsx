'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { MapPin, Globe2 } from 'lucide-react';

type Props = {
  totalCount: number;
  usCount: number;
};

export default function ShopStockToggle({ totalCount, usCount }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const usOnly = searchParams.get('stock') === 'us';

  const navigate = (toUsOnly: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (toUsOnly) params.set('stock', 'us');
    else params.delete('stock');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="diamond-bg-dark border-y border-gold/30 py-5">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-8 md:flex-row">
        <p className="text-[13px] text-cream/85">
          <MapPin size={14} className="mr-1 inline-block text-gold" />
          仓库默认在美国，若仅勾选「国内海运」即视为美国本地无现货。
        </p>
        <div className="inline-flex rounded-md border border-gold/40 bg-wine/40 p-1">
          <button
            type="button"
            onClick={() => navigate(false)}
            className={`flex items-center gap-1.5 rounded px-4 py-1.5 text-[13px] transition-colors ${
              !usOnly ? 'bg-cream text-wine-dark' : 'text-cream/85 hover:text-gold'
            }`}
          >
            <Globe2 size={14} />
            查看全部产品（{totalCount}）
          </button>
          <button
            type="button"
            onClick={() => navigate(true)}
            className={`flex items-center gap-1.5 rounded px-4 py-1.5 text-[13px] transition-colors ${
              usOnly ? 'bg-cream text-wine-dark' : 'text-cream/85 hover:text-gold'
            }`}
          >
            <MapPin size={14} />
            仅看美国有货（{usCount}）
          </button>
        </div>
      </div>
    </div>
  );
}
