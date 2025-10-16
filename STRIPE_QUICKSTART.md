# Guide rapide - Système d'abonnement Stripe

## 🚀 Démarrage rapide

### 1. Installation et configuration (Déjà fait ✅)
```bash
npm install stripe @stripe/stripe-js
```

### 2. Configurer les webhooks en développement

**Terminal 1** - Démarrer le serveur Next.js :
```bash
npm run dev
```

**Terminal 2** - Démarrer le webhook listener Stripe :
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copier le webhook secret affiché (commence par `whsec_...`) et le mettre dans `.env.local` :
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 3. Tester un abonnement

1. Aller sur : http://localhost:3000/pricing
2. Choisir un plan (Basic ou Pro)
3. Utiliser une carte de test : `4242 4242 4242 4242`
4. Vérifier le dashboard : http://localhost:3000/dashboard

## 📊 Fonctionnalités implémentées

### ✅ Gestion des abonnements
- Checkout Stripe intégré
- Customer Portal pour gérer l'abonnement
- Synchronisation automatique via webhooks
- Support de 2 plans (Basic & Pro)

### ✅ Système de quotas
- Vérification automatique avant génération
- Incrémentation après chaque génération
- Réinitialisation automatique à chaque période
- Affichage du quota en temps réel

### ✅ Interface utilisateur
- Page de pricing (`/pricing`)
- Composant de statut d'abonnement
- Indicateurs visuels de quota
- Messages d'erreur clairs

## 🔑 Variables d'environnement

Toutes les variables Stripe sont déjà configurées dans `.env.local` :

```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SIqIO...
STRIPE_SECRET_KEY=sk_test_51SIqIO...
STRIPE_WEBHOOK_SECRET=whsec_... # À configurer après stripe listen
STRIPE_PRICE_ID_BASIC=price_1SIqT23f3KoZz590nJflR6ZU
STRIPE_PRICE_ID_PRO=price_1SIqVw3f3KoZz590boFjfscn
NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC=price_1SIqT23f3KoZz590nJflR6ZU
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_1SIqVw3f3KoZz590boFjfscn
```

## 🧪 Cartes de test Stripe

### Succès
- `4242 4242 4242 4242` - Carte standard

### Échec
- `4000 0000 0000 0002` - Carte refusée

**Pour tous les tests :**
- Date d'expiration : N'importe quelle date future
- CVC : N'importe quel 3 chiffres
- Code postal : N'importe quel code

## 📋 Flow complet

### Souscription
1. Utilisateur clique sur "S'abonner"
2. → `/api/stripe/create-checkout-session`
3. → Redirection vers Stripe Checkout
4. → Paiement effectué
5. → Webhook `checkout.session.completed`
6. → Création dans table `subscriptions`
7. → Redirection vers `/dashboard?success=true`

### Génération d'image
1. Utilisateur soumet une image
2. → `/api/generate` vérifie :
   - ✅ Abonnement actif ?
   - ✅ Quota disponible ?
3. → Génération de l'image
4. → Incrémentation de `quota_used`

### Renouvellement mensuel
1. Stripe facture automatiquement
2. → Webhook `invoice.payment_succeeded`
3. → Réinitialisation de `quota_used` à 0

## 🎯 Points de contrôle

Avant de tester, vérifiez :

```bash
./check-stripe-setup.sh
```

Cela vérifie :
- ✅ Variables d'environnement
- ✅ Fichiers créés
- ✅ Packages installés

## 📱 Pages et composants

### Pages
- `/pricing` - Sélection des plans
- `/dashboard` - Affiche le statut et permet de générer

### Composants
- `<PricingPlans />` - Cartes de tarification
- `<SubscriptionStatus />` - Widget de statut d'abonnement

### API Routes
- `POST /api/stripe/create-checkout-session` - Créer une session de paiement
- `POST /api/stripe/create-portal-session` - Accès au portail client
- `POST /api/stripe/webhook` - Recevoir les événements Stripe
- `GET /api/stripe/subscription-status` - Récupérer le statut

## 🐛 Dépannage

### Le webhook ne fonctionne pas
- Vérifier que `stripe listen` est en cours d'exécution
- Vérifier que `STRIPE_WEBHOOK_SECRET` est correct dans `.env.local`
- Redémarrer le serveur Next.js

### L'abonnement ne s'affiche pas
- Vérifier les logs du webhook dans le terminal
- Vérifier la table `subscriptions` dans Supabase
- Vérifier les logs Stripe : https://dashboard.stripe.com/logs

### Le quota ne se réinitialise pas
- Vérifier que le webhook `invoice.payment_succeeded` est reçu
- Vérifier les logs dans le terminal du webhook listener

## 📚 Documentation complète

Voir `STRIPE_SETUP.md` pour :
- Configuration en production
- Détails sur les webhooks
- Schéma de la base de données
- Tous les événements gérés

## 🎉 C'est prêt !

Votre système d'abonnement Stripe est maintenant configuré et prêt à l'emploi !

Pour tester :
1. `npm run dev` (Terminal 1)
2. `stripe listen --forward-to localhost:3000/api/stripe/webhook` (Terminal 2)
3. Aller sur http://localhost:3000/pricing
