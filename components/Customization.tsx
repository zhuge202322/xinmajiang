import { MessageCircle, Eye, ShoppingBag } from 'lucide-react';

export default function Customization() {
  return (
    <section className="diamond-bg-dark border-y border-gold/30 py-20">
      <div className="mx-auto max-w-[1280px] px-8 text-center">
        <span className="pill-decor-dark">在线客服一对一选配</span>
        <h2 className="mt-6 font-serif text-[44px] font-medium text-cream">
          定制您的专属麻将机
        </h2>
        <p className="mt-3 text-[15px] text-gold-light">
          与客服对话，轻松完成个性化配置
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[15px] text-cream/90">
          <span className="flex items-center gap-2">
            <MessageCircle size={18} className="text-gold" /> 在线问答
          </span>
          <span className="flex items-center gap-2">
            <Eye size={18} className="text-gold" /> 实时预览
          </span>
          <span className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-gold" /> 一键下单
          </span>
        </div>

        {/* 配置预览框 */}
        <div className="mx-auto mt-12 max-w-[860px] rounded-2xl border border-gold/40 bg-cream p-8 text-left shadow-card">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wine text-gold">
              <MessageCircle size={20} />
            </div>
            <div>
              <p className="text-[15px] font-medium text-wine-dark">
                您好，我是 Luundy 麻将机助手
              </p>
              <p className="text-[13px] text-wine-dark/70">
                我来帮您找到最适合的麻将机！请先选择您需要的机型。
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
            {['折叠款四口机', '折叠款旋翼机', '餐桌款四口机', '餐桌款旋翼机', '户外麻将机'].map(
              (t) => (
                <button
                  key={t}
                  className="rounded-lg border border-gold/50 bg-cream2 px-4 py-3 text-[14px] text-wine-dark hover:border-wine hover:bg-white"
                >
                  {t}
                </button>
              )
            )}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-gold/30 pt-4 text-[13px] text-wine-dark/70">
            <span>选择机型后显示起步价</span>
            <span>切换颜色中...</span>
          </div>
        </div>
      </div>
    </section>
  );
}
