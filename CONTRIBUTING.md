# 📝 Bonnes Pratiques et Contributions

## 🎯 Structure du Code

### Organisation des fichiers

```
app/
├── api/          # Routes API
├── gallery/      # Page de galerie
├── layout.tsx    # Layout global
├── page.tsx      # Page d'accueil
└── globals.css   # Styles globaux

components/       # Composants réutilisables
config/          # Configuration et constantes
types/           # Définitions TypeScript
```

## 🔧 Développement

### Installation

```bash
npm install
```

### Lancer le projet

```bash
npm run dev          # Mode développement
npm run build        # Build production
npm start            # Démarrer la production
npm run lint         # Vérifier le code
npm run type-check   # Vérifier TypeScript
npm run check        # Vérifier la configuration
```

## 📐 Standards de Code

### TypeScript

- Utilisez des types explicites
- Évitez `any`, préférez `unknown`
- Utilisez des interfaces pour les objets

```typescript
// ✅ Bon
interface UserData {
  name: string;
  age: number;
}

// ❌ Mauvais
const userData: any = { ... };
```

### React

- Utilisez des functional components
- Préférez les hooks aux class components
- Nommez les composants en PascalCase

```typescript
// ✅ Bon
export default function MyComponent() {
  const [state, setState] = useState();
  return <div>...</div>;
}

// ❌ Mauvais
export default function mycomponent() {
  // ...
}
```

### API Routes

- Gérez toujours les erreurs
- Retournez des status codes appropriés
- Loggez les erreurs importantes

```typescript
// ✅ Bon
try {
  const data = await fetchData();
  return NextResponse.json({ data });
} catch (error) {
  console.error('Error:', error);
  return NextResponse.json(
    { error: 'Message d\'erreur' },
    { status: 500 }
  );
}
```

## 🎨 Styling

- Utilisez Tailwind CSS pour le styling
- Maintenez la cohérence des couleurs
- Utilisez le dark mode

```tsx
// ✅ Bon
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
  {/* contenu */}
</div>
```

## 🔒 Sécurité

### Variables d'environnement

- Ne committez JAMAIS `.env.local`
- Utilisez `NEXT_PUBLIC_` pour les variables client
- Gardez les secrets côté serveur

```typescript
// ✅ Bon (côté serveur)
const apiKey = process.env.REPLICATE_API_TOKEN;

// ✅ Bon (côté client)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

### Upload de fichiers

- Validez toujours les types de fichiers
- Limitez la taille des fichiers
- Nettoyez les noms de fichiers

## 🧪 Tests (Futures améliorations)

Pour ajouter des tests :

```bash
npm install --save-dev @testing-library/react jest
```

## 📦 Nouvelles fonctionnalités

### Ajouter une nouvelle page

1. Créez le fichier dans `app/nouvelle-page/page.tsx`
2. Utilisez le template de base :

```typescript
export default function NouvellePage() {
  return (
    <main className="min-h-screen">
      {/* contenu */}
    </main>
  );
}
```

### Ajouter une API route

1. Créez `app/api/nouvelle-route/route.ts`
2. Exportez les méthodes HTTP :

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: 'Hello' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

### Ajouter un composant

1. Créez `components/MonComposant.tsx`
2. Exportez-le par défaut :

```typescript
interface MonComposantProps {
  title: string;
}

export default function MonComposant({ title }: MonComposantProps) {
  return <div>{title}</div>;
}
```

## 🐛 Debugging

### Logs

```typescript
// Development
console.log('Debug info:', data);

// Production - utilisez un service de logging
if (process.env.NODE_ENV === 'production') {
  // Log to service
}
```

### Erreurs Next.js

- Vérifiez `.next/` pour les fichiers générés
- Nettoyez avec `rm -rf .next`
- Réinstallez avec `rm -rf node_modules && npm install`

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Replicate API](https://replicate.com/docs)

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📋 Checklist avant commit

- [ ] Le code compile sans erreur (`npm run build`)
- [ ] Pas d'erreurs TypeScript (`npm run type-check`)
- [ ] Le linter passe (`npm run lint`)
- [ ] Les variables sensibles ne sont pas committées
- [ ] Le code est commenté si nécessaire
- [ ] Les imports sont propres

## 🎯 Améliorations futures

- [ ] Tests unitaires et d'intégration
- [ ] Authentification utilisateur
- [ ] Système de crédits/quotas
- [ ] Support de plus de modèles IA
- [ ] Édition d'images avancée
- [ ] Partage social
- [ ] Analytics et métriques
- [ ] Rate limiting
- [ ] Webhooks pour les longues générations
- [ ] File d'attente pour les jobs
