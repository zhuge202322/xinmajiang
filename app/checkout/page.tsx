'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, ArrowLeft, CreditCard, Truck, Package, Lock, Settings } from 'lucide-react';

type CartItem = {
  slug: string;
  qty: number;
  configKey?: string;
  configuration?: Record<string, { label: string; price: number; id: string }>;
  price: number;
  productName: string;
  image?: string;
  color?: string;
};

const SHIPPING_OPTIONS = [
  { id: 'ocean', title: '海运直达（30–45 天）', desc: '全美 48 州免费配送，含送货上门', price: 0, icon: Truck },
  { id: 'fedex', title: 'FedEx 派送（3–7 天）', desc: '从美国仓库 FedEx 快递发货', price: 250, icon: Package },
  { id: 'pickup', title: '仓库自提', desc: '洛杉矶 / 纽约仓库就近自取', price: 0, icon: Package },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingStreet: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'US',
    notes: '',
  });
  const [selectedShipping, setSelectedShipping] = useState('ocean');

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cartProducts');
    
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        if (Array.isArray(cart) && cart.length > 0) {
          setCartItems(cart);
        } else {
          router.push('/cart');
        }
      } catch {
        router.push('/cart');
      }
    } else {
      router.push('/cart');
    }
  }, [router]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingCost = SHIPPING_OPTIONS.find(s => s.id === selectedShipping)?.price || 0;
  const total = subtotal + shippingCost - discount;

  const handleInputChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'WELCOME50') {
      setDiscount(50);
    } else {
      setDiscount(0);
      alert('Invalid coupon code');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        shippingStreet: form.shippingStreet,
        shippingCity: form.shippingCity,
        shippingState: form.shippingState,
        shippingZip: form.shippingZip,
        shippingCountry: form.shippingCountry,
        notes: form.notes,
        shippingMethod: selectedShipping,
        shippingFee: shippingCost,
        items: cartItems.map(item => ({
          name: item.productName,
          price: item.price,
          quantity: item.qty,
          image: item.image || '',
          configuration: item.configuration,
        })),
        subtotal,
        total,
        discount,
      };

      // Save order data to localStorage for success page
      localStorage.setItem('pendingOrderData', JSON.stringify(orderData));

      // Create Stripe checkout session
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            name: item.productName,
            price: item.price,
            quantity: item.qty,
            image: item.image || '',
          })),
          customerEmail: form.customerEmail,
          orderData,
        }),
      });

      const data = await res.json();

      if (data.error) {
        // If Stripe not configured, create order directly
        if (data.error === 'Stripe not configured') {
          const orderRes = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
          });

          if (orderRes.ok) {
            const orderResult = await orderRes.json();
            localStorage.removeItem('cart');
            router.push(`/checkout/success?order=${orderResult.order.orderNumber}`);
          } else {
            alert('Failed to create order');
          }
        } else {
          alert(data.message || 'Payment failed');
        }
      } else if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) {
      return form.customerName && form.customerEmail && form.customerPhone;
    }
    if (step === 2) {
      return form.shippingStreet && form.shippingCity && form.shippingState && form.shippingZip;
    }
    if (step === 3) {
      return true;
    }
    return false;
  };

  const steps = [
    { num: 1, label: '联系信息' },
    { num: 2, label: '收货地址' },
    { num: 3, label: '运输方式' },
    { num: 4, label: '支付' },
  ];

  return (
    <main className="diamond-bg py-16">
      <div className="mx-auto max-w-[1280px] px-8">
        <h1 className="text-center font-serif text-[36px] font-medium text-wine-dark">
          结算 · Checkout
        </h1>

        {/* Progress Steps */}
        <div className="mx-auto mt-8 flex max-w-2xl items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.num} className="flex flex-1 items-center">
              <button
                onClick={() => s.num < step && setStep(s.num)}
                className="flex flex-col items-center"
                disabled={s.num > step}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-medium transition-colors ${
                    s.num < step
                      ? 'bg-wine text-cream cursor-pointer'
                      : s.num === step
                      ? 'bg-wine text-cream'
                      : 'bg-cream2 text-wine-dark/60'
                  }`}
                >
                  {s.num < step ? <Check size={16} /> : s.num}
                </div>
                <p className="mt-1 text-[12px] text-wine-dark/70">{s.label}</p>
              </button>
              {i < steps.length - 1 && (
                <div className={`mx-2 h-px flex-1 ${s.num < step ? 'bg-wine' : 'bg-gold/40'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Contact Info */}
            {step === 1 && (
              <section className="card-gold p-6">
                <h2 className="font-serif text-[20px] font-medium text-wine-dark">
                  1. 联系信息
                </h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1 md:col-span-2">
                    <span className="text-[12px] text-wine-dark/70">姓名 *</span>
                    <input
                      type="text"
                      value={form.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      placeholder="张三"
                      className="rounded-md border border-gold/40 bg-cream2 px-3 py-2 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:border-wine focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[12px] text-wine-dark/70">电话 *</span>
                    <input
                      type="tel"
                      value={form.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      placeholder="+1 555 123 4567"
                      className="rounded-md border border-gold/40 bg-cream2 px-3 py-2 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:border-wine focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[12px] text-wine-dark/70">邮箱 *</span>
                    <input
                      type="email"
                      value={form.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      placeholder="you@example.com"
                      className="rounded-md border border-gold/40 bg-cream2 px-3 py-2 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:border-wine focus:outline-none"
                    />
                  </label>
                </div>
              </section>
            )}

            {/* Step 2: Shipping Address */}
            {step === 2 && (
              <section className="card-gold p-6">
                <h2 className="font-serif text-[20px] font-medium text-wine-dark">
                  2. 收货地址
                </h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1 md:col-span-2">
                    <span className="text-[12px] text-wine-dark/70">街道地址 *</span>
                    <input
                      type="text"
                      value={form.shippingStreet}
                      onChange={(e) => handleInputChange('shippingStreet', e.target.value)}
                      placeholder="123 Main St"
                      className="rounded-md border border-gold/40 bg-cream2 px-3 py-2 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:border-wine focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[12px] text-wine-dark/70">城市 *</span>
                    <input
                      type="text"
                      value={form.shippingCity}
                      onChange={(e) => handleInputChange('shippingCity', e.target.value)}
                      placeholder="Los Angeles"
                      className="rounded-md border border-gold/40 bg-cream2 px-3 py-2 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:border-wine focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[12px] text-wine-dark/70">州 *</span>
                    <input
                      type="text"
                      value={form.shippingState}
                      onChange={(e) => handleInputChange('shippingState', e.target.value)}
                      placeholder="CA"
                      className="rounded-md border border-gold/40 bg-cream2 px-3 py-2 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:border-wine focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[12px] text-wine-dark/70">邮编 *</span>
                    <input
                      type="text"
                      value={form.shippingZip}
                      onChange={(e) => handleInputChange('shippingZip', e.target.value)}
                      placeholder="90001"
                      className="rounded-md border border-gold/40 bg-cream2 px-3 py-2 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:border-wine focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[12px] text-wine-dark/70">国家</span>
                    <select
                      value={form.shippingCountry}
                      onChange={(e) => handleInputChange('shippingCountry', e.target.value)}
                      className="rounded-md border border-gold/40 bg-cream2 px-3 py-2 text-[14px] text-wine-dark focus:border-wine focus:outline-none"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="CN">China</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 md:col-span-2">
                    <span className="text-[12px] text-wine-dark/70">订单备注</span>
                    <textarea
                      value={form.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="特殊要求或备注..."
                      rows={2}
                      className="rounded-md border border-gold/40 bg-cream2 px-3 py-2 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:border-wine focus:outline-none"
                    />
                  </label>
                </div>
              </section>
            )}

            {/* Step 3: Shipping Method */}
            {step === 3 && (
              <section className="card-gold p-6">
                <h2 className="font-serif text-[20px] font-medium text-wine-dark">
                  3. 运输方式
                </h2>
                <div className="mt-4 space-y-3">
                  {SHIPPING_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-start justify-between gap-4 rounded-md border p-4 cursor-pointer transition-colors ${
                          selectedShipping === option.id
                            ? 'border-wine bg-cream2'
                            : 'border-gold/40 hover:border-wine'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={selectedShipping === option.id}
                            onChange={() => setSelectedShipping(option.id)}
                            className="mt-1 accent-wine"
                          />
                          <div>
                            <p className="text-[14px] font-medium text-wine-dark">{option.title}</p>
                            <p className="text-[12px] text-wine-dark/70">{option.desc}</p>
                          </div>
                        </div>
                        <span className="text-[14px] text-wine font-medium">
                          {option.price === 0 ? '免费' : `$${option.price}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <section className="card-gold p-6">
                <h2 className="font-serif text-[20px] font-medium text-wine-dark">
                  4. 支付方式
                </h2>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-4 rounded-lg border border-wine bg-cream2 p-4">
                    <input
                      type="radio"
                      name="payment"
                      checked
                      readOnly
                      className="accent-wine"
                    />
                    <CreditCard className="text-wine" size={24} />
                    <div>
                      <p className="font-medium text-wine-dark">Credit Card (Stripe)</p>
                      <p className="text-sm text-wine-dark/70">Pay securely with Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-wine-dark/60">
                    <Lock size={14} />
                    Your payment information is encrypted and secure
                  </div>
                </div>
              </section>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-wine-dark/70 hover:text-wine"
                >
                  <ArrowLeft size={16} />
                  返回
                </button>
              ) : (
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-wine-dark/70 hover:text-wine"
                >
                  <ArrowLeft size={16} />
                  返回购物车
                </Link>
              )}

              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="btn-wine disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  继续
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-wine disabled:opacity-50"
                >
                  {loading ? '处理中...' : '提交订单'}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <aside className="card-gold h-max p-6">
            <h2 className="font-serif text-[20px] font-medium text-wine-dark">
              订单摘要
            </h2>

            {/* Items */}
            <div className="mt-4 space-y-3 max-h-48 overflow-auto">
              {cartItems.map((item, index) => (
                <div key={`${item.slug}-${item.configKey || index}`} className="flex gap-3">
                  <div className="w-16 h-16 bg-cream2 rounded overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-wine-dark/30">
                        <Package size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-wine-dark truncate">{item.productName}</p>
                    {/* Show configuration summary */}
                    {item.configuration && Object.keys(item.configuration).length > 0 && (
                      <p className="text-[11px] text-wine-dark/50 truncate">
                        {Object.values(item.configuration).map(v => v.label).join(', ')}
                      </p>
                    )}
                    <p className="text-[12px] text-wine-dark/60">x{item.qty}</p>
                    <p className="text-[14px] text-wine">${item.price * item.qty}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="mt-4 pt-4 border-t border-gold/30">
              <p className="mb-2 text-[13px] text-wine-dark/70">优惠码</p>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="WELCOME50"
                  className="flex-1 rounded-md border border-gold/40 bg-cream2 px-3 py-2 text-[14px] text-wine-dark placeholder:text-wine-dark/40 focus:border-wine focus:outline-none"
                />
                <button
                  onClick={applyCoupon}
                  className="rounded-md bg-wine px-3 text-[13px] text-cream hover:bg-wine/90"
                >
                  应用
                </button>
              </div>
            </div>

            {/* Totals */}
            <div className="mt-4 space-y-2 text-[14px] text-wine-dark/85">
              <div className="flex justify-between">
                <span>商品小计</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>运费</span>
                <span className="text-gold">
                  {shippingCost === 0 ? '免费' : `$${shippingCost}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-gold">
                  <span>优惠</span>
                  <span>-${discount}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-gold/30 pt-4">
              <span className="text-[14px] text-wine-dark/70">合计</span>
              <span className="font-serif text-[28px] font-medium text-wine">${total}</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
