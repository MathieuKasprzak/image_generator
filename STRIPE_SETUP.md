# Configuration du système d'abonnement Stripe

## Vue d'ensemble

Le système d'abonnement Stripe a été intégré avec les fonctionnalités suivantes :

- ✅ Deux plans d'abonnement (Basic et Pro)
- ✅ Gestion des quotas de génération
- ✅ Webhooks pour synchronisation automatique
- ✅ Interface de gestion d'abonnement
- ✅ Vérification automatique des quotas

## Plans disponibles

### Plan Basic - 9€/mois
- 50 générations par mois
- Accès aux modèles standard
- Support par email

### Plan Pro - 19€/mois
- 200 générations par mois
- Accès aux modèles premium
- Support prioritaire
- Historique illimité

## Configuration requise

### 1. Variables d'environnement

Assurez-vous que toutes ces variables sont définies dans `.env.local` :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xwtyntoyitbbtspywfjg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# Replicate
REPLICATE_API_TOKEN=votre_replicate_token

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret
STRIPE_PRICE_ID_BASIC=price_1SIqT23f3KoZz590nJflR6ZU
STRIPE_PRICE_ID_PRO=price_1SIqVw3f3KoZz590boFjfscn
NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC=price_1SIqT23f3KoZz590nJflR6ZU
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_1SIqVw3f3KoZz590boFjfscn

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Configuration des Webhooks Stripe

#### En développement (avec Stripe CLI)

1. **Installer Stripe CLI** :
```bash
brew install stripe/stripe-cli/stripe
```

2. **Se connecter à Stripe** :
```bash
stripe login
```

3. **Démarrer le webhook listener** :
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. **Copier le webhook secret** affiché et le mettre dans `.env.local` :
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

#### En production

1. Aller sur le dashboard Stripe : https://dashboard.stripe.com/webhooks

2. Cliquer sur "Add endpoint"

3. Configurer l'URL : `https://votre-domaine.com/api/stripe/webhook`

4. Sélectionner les événements suivants :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. Copier le webhook secret et le mettre dans vos variables d'environnement de production

### 3. Configuration du Customer Portal Stripe

1. Aller sur : https://dashboard.stripe.com/settings/billing/portal

2. Activer le Customer Portal

3. Configurer les options :
   - ✅ Autoriser les clients à annuler leur abonnement
   - ✅ Autoriser les clients à mettre à jour leur méthode de paiement
   - ✅ Autoriser les clients à voir l'historique des factures

## Structure de la base de données

La table `subscriptions` a été créée avec le schéma suivant :

```sql
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,
  stripe_price_id text,
  status text,
  current_period_end timestamp without time zone,
  quota_limit integer DEFAULT 50,
  quota_used integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
```

## API Routes créées

### `/api/stripe/create-checkout-session` (POST)
Crée une session de checkout Stripe pour un abonnement

**Body** :
```json
{
  "priceId": "price_xxxxx"
}
```

### `/api/stripe/create-portal-session` (POST)
Crée une session pour le Customer Portal Stripe

### `/api/stripe/webhook` (POST)
Endpoint pour recevoir les webhooks de Stripe
- Gère les événements d'abonnement
- Met à jour la base de données
- Réinitialise les quotas

### `/api/stripe/subscription-status` (GET)
Récupère le statut d'abonnement de l'utilisateur connecté

## Composants créés

### `<PricingPlans />`
Affiche les plans disponibles et permet de s'abonner
- Utilisation : `import PricingPlans from '@/components/PricingPlans'`

### `<SubscriptionStatus />`
Affiche le statut de l'abonnement actuel et le quota
- Utilisation : `import SubscriptionStatus from '@/components/SubscriptionStatus'`

## Fonctionnement du système de quotas

1. **À la génération** : L'API `/api/generate` vérifie :
   - L'utilisateur a un abonnement actif
   - Le quota n'est pas dépassé
   - Incrémente `quota_used` après génération réussie

2. **Réinitialisation automatique** :
   - Quand Stripe envoie `invoice.payment_succeeded`
   - Le `quota_used` est remis à 0
   - Se produit automatiquement au début de chaque période

3. **Statuts d'abonnement** :
   - `active` : Abonnement actif
   - `trialing` : Période d'essai
   - `past_due` : Paiement échoué
   - `canceled` : Abonnement annulé

## Tests

### Tester un abonnement

1. Démarrer le serveur et le webhook listener :
```bash
npm run dev
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

2. Aller sur `/pricing` et cliquer sur "S'abonner"

3. Utiliser une carte de test Stripe :
   - Numéro : `4242 4242 4242 4242`
   - Date : N'importe quelle date future
   - CVC : N'importe quel 3 chiffres

4. Vérifier le dashboard pour voir le statut

### Tester le quota

1. Générer des images jusqu'à atteindre la limite

2. Vérifier que l'API retourne une erreur 403

3. Vérifier que le composant `SubscriptionStatus` affiche un avertissement

## Pages créées/modifiées

- ✅ `/pricing` - Page de tarification
- ✅ `/dashboard` - Affiche maintenant le statut d'abonnement
- ✅ `/api/generate` - Vérifie les quotas avant génération

## Prochaines étapes

1. **Configurer les webhooks en production**
2. **Activer le Customer Portal sur Stripe**
3. **Tester tous les scénarios** :
   - Souscription
   - Changement de plan
   - Annulation
   - Renouvellement
4. **Ajouter des emails de notification** (optionnel)

## Support

Pour toute question sur Stripe :
- Documentation : https://stripe.com/docs
- Dashboard : https://dashboard.stripe.com
- Webhook logs : https://dashboard.stripe.com/webhooks
