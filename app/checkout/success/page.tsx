'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, Mail, Phone } from 'lucide-react';

type OrderInfo = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: any[];
  status: string;
  paymentStatus: string;
  shippingMethod: string;
};

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function confirmOrder() {
      // Clear cart after successful payment
      try {
        localStorage.removeItem('cart');
        localStorage.removeItem('cartProducts');
      } catch (e) {
        console.error('Failed to clear cart:', e);
      }

      // Get order info from URL params
      const orderNumber = searchParams.get('order');
      const sessionId = searchParams.get('session_id');

      if (orderNumber) {
        // Order was already created (non-Stripe flow)
        setOrder({
          orderNumber,
          customerName: '',
          customerEmail: '',
          total: 0,
          items: [],
          status: 'pending',
          paymentStatus: 'pending',
          shippingMethod: 'ocean',
        });
        setLoading(false);
      } else if (sessionId) {
        // Stripe payment - confirm and create order via API
        try {
          // Get saved order data from localStorage
          const savedOrderData = localStorage.getItem('pendingOrderData');
          const orderData = savedOrderData ? JSON.parse(savedOrderData) : {};

          const res = await fetch('/api/stripe/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, orderData }),
          });

          const data = await res.json();

          if (data.success && data.order) {
            setOrder({
              orderNumber: data.order.orderNumber,
              customerName: data.order.customerName,
              customerEmail: data.order.customerEmail,
              total: data.order.total,
              items: data.order.items,
              status: data.order.status,
              paymentStatus: data.order.paymentStatus,
              shippingMethod: 'ocean',
            });
            // Clear saved order data
            localStorage.removeItem('pendingOrderData');
          } else {
            // Fallback display
            setOrder({
              orderNumber: sessionId.slice(-10).toUpperCase(),
              customerName: '',
              customerEmail: '',
              total: 0,
              items: [],
              status: 'confirmed',
              paymentStatus: 'paid',
              shippingMethod: 'ocean',
            });
          }
        } catch (error) {
          console.error('Failed to confirm order:', error);
          // Fallback display
          setOrder({
            orderNumber: sessionId.slice(-10).toUpperCase(),
            customerName: '',
            customerEmail: '',
            total: 0,
            items: [],
            status: 'confirmed',
            paymentStatus: 'paid',
            shippingMethod: 'ocean',
          });
        }
        setLoading(false);
      } else {
        // Check localStorage for any saved order
        try {
          const savedOrder = localStorage.getItem('lastOrder');
          if (savedOrder) {
            setOrder(JSON.parse(savedOrder));
          }
        } catch (e) {
          console.error('Failed to parse saved order:', e);
        }
        setLoading(false);
      }
    }

    confirmOrder();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wine"></div>
      </div>
    );
  }

  return (
    <main className="diamond-bg py-16">
      <div className="mx-auto max-w-2xl px-8">
        {/* Success Card */}
        <div className="rounded-2xl bg-wine-dark p-8 text-cream shadow-card text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-600">
            <CheckCircle size={40} className="text-cream" />
          </div>
          
          <h1 className="mt-6 font-serif text-[32px] font-medium text-gold">
            订单提交成功！
          </h1>
          <p className="mt-2 text-[14px] text-cream/80">
            Thank You for Your Order
          </p>

          {order && (
            <div className="mt-6 rounded-lg bg-wine-deeper p-4">
              <p className="text-[12px] text-cream/60">订单号 / Order Number</p>
              <p className="mt-1 font-serif text-[24px] tracking-wider text-gold-light">
                {order.orderNumber || 'PENDING'}
              </p>
            </div>
          )}

          <div className="mt-6 space-y-3 text-[14px] text-cream/80">
            <p>
              我们已收到您的订单，正在处理中。
            </p>
            <p>
              付款成功后，您将收到一封确认邮件。
            </p>
          </div>
        </div>

        {/* Order Details */}
        {order && (
          <div className="mt-6 rounded-xl bg-white p-6 shadow-card">
            <h2 className="font-serif text-[20px] font-medium text-wine-dark">
              下一步
            </h2>
            
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-cream2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wine text-gold">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-medium text-wine-dark">查收确认邮件</p>
                  <p className="mt-1 text-[13px] text-wine-dark/70">
                    我们已发送订单确认到您的邮箱，包含订单详情和追踪链接。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-cream2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wine text-gold">
                  <Package size={18} />
                </div>
                <div>
                  <p className="font-medium text-wine-dark">订单处理中</p>
                  <p className="mt-1 text-[13px] text-wine-dark/70">
                    您的订单将在 1-2 个工作日内处理完成。发货后我们会邮件通知您。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-card">
          <h2 className="font-serif text-[20px] font-medium text-wine-dark">
            需要帮助？
          </h2>
          <p className="mt-2 text-[14px] text-wine-dark/70">
            如有任何问题，请随时联系我们：
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:support@zhongque.com"
              className="flex items-center justify-center gap-2 rounded-lg border border-gold/40 px-4 py-3 text-wine hover:bg-cream2 transition-colors"
            >
              <Mail size={18} />
              support@zhongque.com
            </a>
            <a
              href="tel:+1234567890"
              className="flex items-center justify-center gap-2 rounded-lg border border-gold/40 px-4 py-3 text-wine hover:bg-cream2 transition-colors"
            >
              <Phone size={18} />
              +1 (234) 567-890
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Link
            href="/order-tracking"
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-wine px-6 py-3 text-cream hover:bg-wine/90 transition-colors"
          >
            追踪订单 <ArrowRight size={16} />
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gold/40 px-6 py-3 text-wine hover:bg-cream2 transition-colors"
          >
            继续购物
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wine"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
