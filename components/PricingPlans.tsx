'use client';

import { useState } from 'react';
import { getStripe } from '@/lib/stripe/client';

interface Plan {
  name: string;
  priceId: string;
  price: number;
  quota: number;
  features: string[];
}

const plans: Plan[] = [
  {
    name: 'Plan Basic',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC || 'price_1SIqT23f3KoZz590nJflR6ZU',
    price: 9,
    quota: 50,
    features: [
      '50 générations par mois',
      'Accès aux modèles standard',
      'Support par email',
    ],
  },
  {
    name: 'Plan Pro',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || 'price_1SIqVw3f3KoZz590boFjfscn',
    price: 19,
    quota: 200,
    features: [
      '200 générations par mois',
      'Accès aux modèles premium',
      'Support prioritaire',
      'Historique illimité',
    ],
  },
];

export default function PricingPlans() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(priceId);

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création de la session');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choisissez votre plan
          </h2>
          <p className="text-lg text-gray-600">
            Commencez à générer des images avec l'IA
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.priceId}
              className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200 hover:border-blue-500 transition-colors"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}€
                </span>
                <span className="text-gray-600">/mois</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.priceId)}
                disabled={loading !== null}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  loading === plan.priceId
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading === plan.priceId ? 'Chargement...' : 'S\'abonner'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
