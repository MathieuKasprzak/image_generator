# 🎯 Commandes Utiles - Référence Rapide

## 🚀 Commandes de Démarrage

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm start

# Vérifier la configuration
npm run check
```

## 🔍 Commandes de Vérification

```bash
# Vérifier TypeScript
npm run type-check

# Linter
npm run lint

# Vérifier tout
npm run check && npm run type-check && npm run lint
```

## 🧹 Commandes de Nettoyage

```bash
# Nettoyer le cache Next.js
rm -rf .next

# Nettoyer node_modules
rm -rf node_modules package-lock.json
npm install

# Nettoyer tout
rm -rf .next node_modules package-lock.json
npm install
```

## 🗄️ Supabase

### Via Interface Web

```
1. https://xwtyntoyitbbtspywfjg.supabase.co
2. Storage > Créer buckets
3. SQL Editor > Exécuter supabase-setup.sql
```

### Via CLI (optionnel)

```bash
# Installer Supabase CLI
npm install -g supabase

# Login
supabase login

# Link au projet
supabase link --project-ref xwtyntoyitbbtspywfjg

# Exécuter migrations
supabase db push
```

## 🤖 Replicate

### Tester l'API

```bash
# Test simple
curl -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Token YOUR_REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "jagilley/controlnet-scribble",
    "input": {
      "image": "https://example.com/image.jpg",
      "prompt": "a beautiful landscape"
    }
  }'
```

## 📦 Git

```bash
# Initialiser git
git init

# Ajouter tout
git add .

# Commit
git commit -m "Initial commit: Image generator with AI"

# Ajouter remote
git remote add origin <your-repo-url>

# Push
git push -u origin main
```

## 🚀 Déploiement

### Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Login
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

### Netlify

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Déployer
netlify deploy

# Déployer en production
netlify deploy --prod
```

## 🐛 Debug

### Voir les logs Next.js

```bash
# Mode développement avec logs détaillés
DEBUG=* npm run dev

# Build avec logs
npm run build 2>&1 | tee build.log
```

### Tester l'API localement

```bash
# Test upload
curl -X POST http://localhost:3000/api/generate \
  -F "image=@test.jpg" \
  -F "prompt=test prompt"

# Test projets
curl http://localhost:3000/api/projects
```

### Vérifier les variables d'environnement

```bash
# Afficher toutes les variables (attention aux secrets !)
cat .env.local

# Vérifier une variable spécifique
grep SUPABASE_URL .env.local
```

## 📊 Monitoring

### Taille du build

```bash
# Analyser le build
npm run build
ls -lh .next/static/chunks
```

### Performance

```bash
# Lighthouse (nécessite Chrome)
npx lighthouse http://localhost:3000 --view

# Bundle analyzer
npm install --save-dev @next/bundle-analyzer
```

## 🧪 Tests (à ajouter)

```bash
# Installer Jest
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Lancer les tests
npm test

# Tests avec couverture
npm test -- --coverage
```

## 🔧 Outils de Développement

### Format du code

```bash
# Installer Prettier
npm install --save-dev prettier

# Formatter
npx prettier --write .
```

### Git hooks

```bash
# Installer Husky
npm install --save-dev husky

# Configurer pre-commit
npx husky add .husky/pre-commit "npm run lint"
```

## 📝 Base de données

### Backup Supabase

Via l'interface :
1. Settings > Database
2. Database Backups
3. Create backup

Via CLI :
```bash
supabase db dump -f backup.sql
```

### Restaurer

```bash
supabase db reset
psql -h db.xwtyntoyitbbtspywfjg.supabase.co -U postgres -f backup.sql
```

## 🔑 Gestion des Secrets

### Rotation des clés

1. Supabase : Settings > API > Reset keys
2. Replicate : Account > API Tokens > Regenerate
3. Mettre à jour `.env.local`
4. Redéployer

### Vérifier les secrets exposés

```bash
# Vérifier dans le repo
git log --all --full-history --source -- .env.local

# Scanner les secrets (nécessite gitleaks)
gitleaks detect --source .
```

## 🎨 UI/UX

### Générer des couleurs Tailwind

```bash
# Via site web
open https://tailwindcss.com/docs/customizing-colors

# Tester les couleurs
npm install -D @tailwindcss/forms @tailwindcss/typography
```

## 📱 Testing Responsive

```bash
# Ouvrir avec différentes tailles
# Desktop
open -a "Google Chrome" --args --window-size=1920,1080 http://localhost:3000

# Mobile
open -a "Google Chrome" --args --window-size=375,667 http://localhost:3000

# Tablet
open -a "Google Chrome" --args --window-size=768,1024 http://localhost:3000
```

## 🚨 Production

### Pre-deployment checklist

```bash
# 1. Build test
npm run build

# 2. Type check
npm run type-check

# 3. Lint
npm run lint

# 4. Vérifier les secrets
cat .env.local | wc -l  # Devrait afficher 4 lignes

# 5. Test local en mode production
npm run build && npm start
```

### Post-deployment

```bash
# Tester la prod
curl -I https://your-domain.com

# Vérifier les logs (Vercel)
vercel logs <deployment-url>

# Monitor les erreurs
curl https://your-domain.com/api/health
```

## 💡 Astuces

```bash
# Ouvrir tout dans VS Code
code .

# Voir la taille du projet
du -sh .

# Nettoyer les fichiers temporaires
find . -name ".DS_Store" -delete

# Compter les lignes de code
find . -name "*.ts" -o -name "*.tsx" | xargs wc -l
```

---

## 📞 Aide Rapide

```bash
# Projet ne démarre pas ?
rm -rf .next node_modules && npm install && npm run dev

# Erreurs TypeScript ?
npm run type-check

# Problème Supabase ?
./check-setup.sh

# Tout casser et recommencer ?
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

---

## 🎓 Ressources

- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Replicate Docs: https://replicate.com/docs
- Tailwind Docs: https://tailwindcss.com/docs
