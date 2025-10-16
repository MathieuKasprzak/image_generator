# Variables d'environnement requises pour la production Vercel

## ✅ Liste complète des variables à configurer

### 1. Supabase (Base de données et authentification)
```
NEXT_PUBLIC_SUPABASE_URL=https://votre_projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```
⚠️ **Récupérer depuis votre `.env.local`**

### 2. Replicate (Génération d'images IA)
```
REPLICATE_API_TOKEN=r8_votre_token_replicate
```
⚠️ **Récupérer depuis votre `.env.local`**

### 3. Stripe (Paiements et abonnements)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_publishable_key
STRIPE_SECRET_KEY=sk_test_votre_secret_key
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret_production
STRIPE_PRICE_ID_BASIC=price_1SIqT23f3KoZz590nJflR6ZU
STRIPE_PRICE_ID_PRO=price_1SIqVw3f3KoZz590boFjfscn
NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC=price_1SIqT23f3KoZz590nJflR6ZU
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_1SIqVw3f3KoZz590boFjfscn
```

### 4. Application (Optionnel mais recommandé)
```
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
```

---

## 🚀 Étapes pour configurer sur Vercel

1. **Aller sur** https://vercel.com/dashboard
2. **Sélectionner** votre projet
3. **Settings** → **Environment Variables**
4. **Ajouter** chaque variable une par une
5. **Cocher** : Production + Preview + Development
6. **Save** et **Redeploy**

---

## ⚠️ Variables critiques manquantes actuellement

Si vous voyez ces erreurs, vérifiez ces variables :

| Erreur | Variable manquante |
|--------|-------------------|
| `Unauthenticated` (Replicate) | `REPLICATE_API_TOKEN` |
| `Non autorisé` (Supabase) | `SUPABASE_SERVICE_ROLE_KEY` |
| `Invalid API Key` (Stripe) | `STRIPE_SECRET_KEY` |
| Redirect vers localhost | `NEXT_PUBLIC_APP_URL` (optionnel) |

---

## ✅ Checklist de configuration

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `REPLICATE_API_TOKEN` ⚠️ **MANQUANT ACTUELLEMENT**
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET` (configurer après avoir créé le webhook)
- [ ] `STRIPE_PRICE_ID_BASIC`
- [ ] `STRIPE_PRICE_ID_PRO`
- [ ] `NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC`
- [ ] `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO`

---

## 🔒 Sécurité

**IMPORTANT** : Ne jamais commiter ces variables dans Git !
- Elles sont dans `.env.local` (ignoré par git)
- Configurées uniquement sur Vercel
- Pas dans le code source public

---

## 📝 Note

Les clés Stripe actuelles sont en mode **test**. Pour la production réelle :
1. Basculer Stripe en mode Live
2. Obtenir de nouvelles clés Live
3. Mettre à jour les variables d'environnement
