#!/bin/bash

echo "🔍 Vérification de la configuration Stripe..."
echo ""

# Vérifier les variables d'environnement
echo "📋 Variables d'environnement :"
echo ""

check_env() {
  local var_name=$1
  local var_value=$(grep "^$var_name=" .env.local 2>/dev/null | cut -d '=' -f 2-)
  
  if [ -n "$var_value" ]; then
    echo "✅ $var_name est défini"
  else
    echo "❌ $var_name n'est PAS défini"
    return 1
  fi
}

# Variables Stripe requises
check_env "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
check_env "STRIPE_SECRET_KEY"
check_env "STRIPE_WEBHOOK_SECRET"
check_env "STRIPE_PRICE_ID_BASIC"
check_env "STRIPE_PRICE_ID_PRO"
check_env "NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC"
check_env "NEXT_PUBLIC_STRIPE_PRICE_ID_PRO"

echo ""
echo "📁 Fichiers créés :"
echo ""

# Vérifier les fichiers
files=(
  "lib/stripe/client.ts"
  "lib/stripe/server.ts"
  "app/api/stripe/create-checkout-session/route.ts"
  "app/api/stripe/create-portal-session/route.ts"
  "app/api/stripe/webhook/route.ts"
  "app/api/stripe/subscription-status/route.ts"
  "components/PricingPlans.tsx"
  "components/SubscriptionStatus.tsx"
  "app/pricing/page.tsx"
  "STRIPE_SETUP.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file manquant"
  fi
done

echo ""
echo "📦 Package Stripe installé :"
if npm list stripe --depth=0 2>/dev/null | grep -q "stripe@"; then
  echo "✅ stripe (serveur)"
else
  echo "❌ stripe non installé"
fi

if npm list @stripe/stripe-js --depth=0 2>/dev/null | grep -q "@stripe/stripe-js@"; then
  echo "✅ @stripe/stripe-js (client)"
else
  echo "❌ @stripe/stripe-js non installé"
fi

echo ""
echo "🔧 Prochaines étapes :"
echo ""
echo "1. Configurer le webhook Stripe :"
echo "   stripe listen --forward-to localhost:3000/api/stripe/webhook"
echo ""
echo "2. Copier le webhook secret dans .env.local"
echo ""
echo "3. Démarrer le serveur :"
echo "   npm run dev"
echo ""
echo "4. Tester l'abonnement sur http://localhost:3000/pricing"
echo ""
echo "📚 Voir STRIPE_SETUP.md pour plus de détails"
