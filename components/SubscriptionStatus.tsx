'use client';

import { useEffect, useState } from 'react';

interface SubscriptionInfo {
  subscription: {
    status: string;
    quota_limit: number;
    quota_used: number;
    current_period_end: string;
    stripe_price_id: string;
  } | null;
  hasActiveSubscription: boolean;
  quotaUsed: number;
  quotaLimit: number;
}

export default function SubscriptionStatus() {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [managingPortal, setManagingPortal] = useState(false);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/stripe/subscription-status');
      const data = await response.json();
      setSubscriptionInfo(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setManagingPortal(true);
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur est survenue');
    } finally {
      setManagingPortal(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!subscriptionInfo?.hasActiveSubscription) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">
          Aucun abonnement actif
        </h3>
        <p className="text-yellow-700 mb-4">
          Souscrivez à un plan pour commencer à générer des images.
        </p>
        <a
          href="/pricing"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Voir les plans
        </a>
      </div>
    );
  }

  const { subscription } = subscriptionInfo;
  if (!subscription) return null;

  const quotaPercentage = (subscription.quota_used / subscription.quota_limit) * 100;
  const isPro = subscription.stripe_price_id?.includes('Pro') || subscription.quota_limit > 50;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isPro ? 'Plan Pro' : 'Plan Basic'}
          </h3>
          <p className="text-sm text-gray-600 capitalize">
            Statut: {subscription.status === 'active' ? 'Actif' : subscription.status}
          </p>
        </div>
        <button
          onClick={handleManageSubscription}
          disabled={managingPortal}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {managingPortal ? 'Chargement...' : 'Gérer l\'abonnement'}
        </button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Générations utilisées</span>
          <span className="font-medium">
            {subscription.quota_used} / {subscription.quota_limit}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${
              quotaPercentage >= 90
                ? 'bg-red-600'
                : quotaPercentage >= 70
                ? 'bg-yellow-500'
                : 'bg-green-600'
            }`}
            style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
          />
        </div>
      </div>

      {subscription.current_period_end && (
        <p className="text-xs text-gray-500">
          Renouvellement le{' '}
          {new Date(subscription.current_period_end).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      )}

      {quotaPercentage >= 90 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-700">
            ⚠️ Vous approchez de votre limite. Pensez à passer au plan supérieur !
          </p>
        </div>
      )}
    </div>
  );
}
