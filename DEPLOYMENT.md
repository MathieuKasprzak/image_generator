# 🚀 Guide de Déploiement

## Déploiement sur Vercel (Recommandé)

### Option 1 : Via l'interface web

1. Créez un compte sur [Vercel](https://vercel.com)
2. Importez votre repository GitHub/GitLab
3. Vercel détectera automatiquement Next.js
4. Configurez les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `REPLICATE_API_TOKEN`
5. Déployez !

### Option 2 : Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Configurer les variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add REPLICATE_API_TOKEN

# Redéployer avec les nouvelles variables
vercel --prod
```

## Déploiement sur Netlify

1. Créez un compte sur [Netlify](https://netlify.com)
2. Importez votre repository
3. Build command : `npm run build`
4. Publish directory : `.next`
5. Ajoutez les variables d'environnement dans Settings > Environment variables

## Déploiement sur un VPS (Ubuntu/Debian)

### 1. Prérequis

```bash
# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PM2 pour gérer le processus
sudo npm install -g pm2
```

### 2. Déploiement

```bash
# Cloner le projet
git clone <your-repo-url>
cd image_generator

# Installer les dépendances
npm install

# Créer le fichier .env.local avec vos variables
nano .env.local

# Build pour production
npm run build

# Lancer avec PM2
pm2 start npm --name "image-generator" -- start

# Sauvegarder la configuration PM2
pm2 save
pm2 startup
```

### 3. Configuration Nginx (optionnel)

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Déploiement sur Railway

1. Créez un compte sur [Railway](https://railway.app)
2. Créez un nouveau projet
3. Connectez votre repository GitHub
4. Railway détectera automatiquement Next.js
5. Ajoutez les variables d'environnement
6. Déployez !

## Configuration post-déploiement

### 1. Configurer les domaines dans next.config.js

```javascript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xwtyntoyitbbtspywfjg.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
    ],
  },
};
```

### 2. Configurer CORS sur Supabase (si nécessaire)

1. Allez dans Settings > API
2. Ajoutez votre domaine de production dans "Allowed Origins"

### 3. Vérifier les limites de taille de fichiers

Pour augmenter la limite d'upload, ajoutez dans `next.config.js` :

```javascript
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
```

## 📊 Monitoring

### Logs avec Vercel

```bash
# Voir les logs en temps réel
vercel logs <deployment-url>
```

### Logs avec PM2

```bash
# Voir les logs
pm2 logs image-generator

# Monitoring
pm2 monit
```

## 🔒 Sécurité en production

### 1. Variables d'environnement

- ❌ Ne JAMAIS committer `.env.local`
- ✅ Utiliser les variables d'environnement de votre plateforme
- ✅ Activer RLS (Row Level Security) sur Supabase

### 2. CORS et domaines

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://votre-domaine.com' },
        ],
      },
    ];
  },
};
```

### 3. Rate limiting

Considérez l'ajout d'un rate limiter pour l'API :

```bash
npm install @upstash/ratelimit
```

## 🧪 Tests avant déploiement

```bash
# Build local pour vérifier
npm run build

# Tester le build
npm start

# Vérifier les erreurs
npm run lint
```

## 📈 Optimisations

1. **Images** : Les images sont automatiquement optimisées par Next.js
2. **Caching** : Configurez un CDN pour les assets statiques
3. **Monitoring** : Utilisez Vercel Analytics ou Google Analytics

## 🆘 Troubleshooting

### Erreur "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur de build
```bash
# Vérifier les types TypeScript
npm run type-check

# Forcer le build
npm run build -- --no-lint
```

### Erreur 504 Timeout
- Augmentez le timeout de fonction sur votre plateforme
- Vercel : Max 60s sur le plan gratuit
- Considérez l'utilisation de webhooks pour les longues opérations
