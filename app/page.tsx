import Hero from '@/components/Hero';
import FeatureBar from '@/components/FeatureBar';
import Coupons from '@/components/Coupons';
import ProductGrid from '@/components/ProductGrid';
import Shipping from '@/components/Shipping';
import Dealers from '@/components/Dealers';
import Customization from '@/components/Customization';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeatureBar />
      <Coupons />
      <ProductGrid />
      <Shipping />
      <Dealers />
      <Customization />
    </main>
  );
}
