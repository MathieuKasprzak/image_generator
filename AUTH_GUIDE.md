# 🔐 Guide d'Authentification

## 📋 Ce qui a été ajouté

### 1. **Système d'authentification complet**
   - ✅ Inscription par email/mot de passe
   - ✅ Connexion/Déconnexion
   - ✅ Gestion de session automatique
   - ✅ Protection des routes

### 2. **Fichiers créés**

#### Context & Hooks
- `contexts/AuthContext.tsx` - Context React pour l'authentification
- Hook `useAuth()` disponible dans tous les composants

#### Components
- `components/AuthForm.tsx` - Formulaire d'inscription/connexion avec onglets
- `components/Header.tsx` - Header avec menu utilisateur

#### Pages
- `app/page.tsx` - Landing page avec CTA
- `app/login/page.tsx` - Page de connexion
- `app/signup/page.tsx` - Page d'inscription
- `app/dashboard/page.tsx` - Dashboard protégé avec upload et galerie
- `app/auth/callback/route.ts` - Callback pour confirmation email

#### API Routes
- `app/api/generate/route.ts` - Modifié pour vérifier l'auth et ajouter user_id
- `app/api/projects/[id]/route.ts` - DELETE pour supprimer un projet

#### Middleware & Utils
- `middleware.ts` - Protection automatique des routes
- `lib/supabase/client.ts` - Client Supabase pour le navigateur
- `lib/supabase/server.ts` - Client Supabase pour le serveur
- `lib/supabase/middleware.ts` - Utils pour le middleware

#### Database
- `supabase-auth-migration.sql` - Migration pour ajouter user_id et RLS

---

## 🚀 Configuration Supabase

### Étape 1 : Activer l'authentification par email

1. Allez sur [Supabase Dashboard](https://xwtyntoyitbbtspywfjg.supabase.co)
2. **Authentication** > **Providers**
3. Activez **Email**
4. Configurez les paramètres :
   - ✅ Enable Email provider
   - ✅ Confirm email (recommandé pour la production)
   - ✅ Secure email change (recommandé)

### Étape 2 : Exécuter la migration SQL

1. Allez dans **SQL Editor**
2. **New query**
3. Copiez le contenu de `supabase-auth-migration.sql`
4. **Run**

Cette migration va :
- Ajouter la colonne `user_id` à la table `projects`
- Mettre à jour les politiques RLS pour la sécurité
- Créer les index nécessaires

### Étape 3 : Configurer les URLs de redirection (Optionnel)

Pour l'email de confirmation :
1. **Authentication** > **URL Configuration**
2. Ajoutez vos URLs :
   - Production: `https://votre-domaine.com/auth/callback`
   - Development: `http://localhost:3000/auth/callback`

---

## 📝 Utilisation

### Dans un composant client

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, loading, signIn, signUp, signOut } = useAuth();

  if (loading) return <div>Chargement...</div>;

  if (!user) {
    return <div>Non connecté</div>;
  }

  return (
    <div>
      <p>Bonjour {user.email}</p>
      <button onClick={signOut}>Déconnexion</button>
    </div>
  );
}
```

### Dans une Server Component

```typescript
import { createClient } from '@/lib/supabase/server';

export default async function ServerComponent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Non connecté</div>;
  }

  return <div>Bonjour {user.email}</div>;
}
```

### Dans une API Route

```typescript
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  // Votre code ici
}
```

---

## 🔒 Sécurité

### Row Level Security (RLS)

Toutes les données sont protégées par RLS :

```sql
-- Les utilisateurs ne peuvent voir que leurs propres projets
CREATE POLICY "Enable read for own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

-- Les utilisateurs ne peuvent créer que leurs propres projets
CREATE POLICY "Enable insert for authenticated users" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs ne peuvent supprimer que leurs propres projets
CREATE POLICY "Enable delete for own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);
```

### Protection des routes

Le middleware protège automatiquement :
- `/dashboard` - Redirige vers `/login` si non connecté
- `/api/generate` - Retourne 401 si non authentifié
- `/api/projects/*` - Retourne 401 si non authentifié

---

## 🎯 Flux utilisateur

### 1. Inscription

```
1. Utilisateur va sur /signup
2. Remplit le formulaire (email + mot de passe)
3. Clique sur "S'inscrire"
4. Reçoit un email de confirmation (si activé)
5. Clique sur le lien dans l'email
6. Redirigé vers /dashboard
```

### 2. Connexion

```
1. Utilisateur va sur /login
2. Entre ses identifiants
3. Clique sur "Se connecter"
4. Redirigé vers /dashboard
```

### 3. Utilisation

```
1. Sur /dashboard
2. Upload une image
3. Entre un prompt
4. Clique sur "Générer"
5. L'image est générée et sauvegardée avec son user_id
6. Apparaît dans "Mes projets"
```

### 4. Suppression

```
1. Dans "Mes projets"
2. Clique sur "Supprimer"
3. Confirme
4. Le projet ET les images des buckets sont supprimés
```

---

## 🧪 Test

### Tester localement

```bash
# Démarrer l'app
npm run dev

# Aller sur http://localhost:3000
# Cliquer sur "Commencer gratuitement"
# S'inscrire avec un email test
# Se connecter
# Accéder au dashboard
```

### Tester la protection

```bash
# Essayer d'accéder au dashboard sans être connecté
# http://localhost:3000/dashboard
# → Devrait rediriger vers /login

# Essayer d'appeler l'API sans auth
curl -X POST http://localhost:3000/api/generate
# → Devrait retourner 401 Unauthorized
```

---

## 🐛 Dépannage

### "Non autorisé" lors de la génération

- Vérifiez que vous êtes bien connecté
- Vérifiez que le middleware fonctionne
- Vérifiez les cookies dans DevTools

### Les projets n'apparaissent pas

- Vérifiez que `user_id` est bien enregistré en base
- Vérifiez les politiques RLS dans Supabase
- Vérifiez que vous êtes connecté avec le bon compte

### Erreur "Table does not exist"

- Exécutez la migration SQL
- Vérifiez que la colonne `user_id` existe
- Redémarrez l'application

### Email de confirmation non reçu

- Vérifiez vos spams
- Vérifiez que l'email provider est activé dans Supabase
- En dev, désactivez la confirmation d'email dans Supabase

---

## 📊 Base de données

### Structure de la table projects

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  input_image_url TEXT NOT NULL,
  output_image_url TEXT,
  prompt TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
);
```

### Requêtes utiles

```sql
-- Voir tous les projets d'un utilisateur
SELECT * FROM projects WHERE user_id = 'user-uuid';

-- Compter les projets par utilisateur
SELECT user_id, COUNT(*) FROM projects GROUP BY user_id;

-- Voir les utilisateurs
SELECT * FROM auth.users;
```

---

## 🎉 Fonctionnalités complètes

✅ **Authentification**
- Inscription par email
- Connexion par mot de passe
- Déconnexion
- Session persistante

✅ **Sécurité**
- Row Level Security (RLS)
- Protection des routes
- Validation des données
- HTTPS (en production)

✅ **UX**
- Landing page attractive
- Formulaire avec validation
- Messages d'erreur clairs
- Loading states
- Animations

✅ **Dashboard**
- Upload d'images
- Génération IA
- Galerie personnelle
- Suppression de projets

✅ **API**
- Protection par auth
- Association user_id
- Suppression avec nettoyage

---

## 🚀 Déploiement

Lors du déploiement, n'oubliez pas :

1. **Variables d'environnement**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `REPLICATE_API_TOKEN`

2. **URLs de redirection Supabase**
   - Ajoutez votre domaine de production
   - `https://votre-domaine.com/auth/callback`

3. **Configuration email**
   - Configurez un provider SMTP custom (recommandé)
   - Ou utilisez le provider par défaut de Supabase

---

**Votre application est maintenant sécurisée avec authentification complète ! 🎉**
