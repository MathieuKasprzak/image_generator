import PricingPlans from '@/components/PricingPlans';
import Header from '@/components/Header';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <PricingPlans />
      </main>
    </div>
  );
}
