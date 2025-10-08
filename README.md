# 🎨 Éditeur d'Images IA

Application Next.js pour transformer des images avec l'intelligence artificielle en utilisant Replicate et Supabase.

## 🚀 Fonctionnalités

- Upload d'images via interface intuitive
- Transformation d'images avec l'IA (modèle ControlNet)
- Stockage sécurisé des images sur Supabase
- Historique des transformations en base de données
- Interface moderne et responsive avec Tailwind CSS

## 📋 Prérequis

- Node.js 18+ installé
- Compte Supabase configuré avec :
  - Bucket `input-images` (public)
  - Bucket `output-images` (public)
  - Table `projects` avec les colonnes :
    - `id` (UUID, primary key, default: uuid_generate_v4())
    - `created_at` (TIMESTAMP, default: now())
    - `input_image_url` (TEXT)
    - `output_image_url` (TEXT)
    - `prompt` (TEXT)
    - `status` (TEXT)
- Token API Replicate

## 🛠️ Installation

1. Installer les dépendances :
```bash
npm install
```

2. Les variables d'environnement sont déjà configurées dans `.env.local`

## 🗄️ Configuration Supabase

### Créer les buckets de stockage :

1. Allez dans Storage > Create bucket
2. Créez `input-images` (public)
3. Créez `output-images` (public)

### Créer la table projects :

```sql
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  input_image_url TEXT,
  output_image_url TEXT,
  prompt TEXT,
  status TEXT
);

-- Activer Row Level Security (optionnel)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Créer une policy pour permettre l'insertion (optionnel)
CREATE POLICY "Enable insert for all users" ON projects
  FOR INSERT WITH CHECK (true);

-- Créer une policy pour permettre la lecture (optionnel)
CREATE POLICY "Enable read for all users" ON projects
  FOR SELECT USING (true);
```

### Configurer les politiques de stockage :

Pour les deux buckets, ajoutez ces politiques :

```sql
-- Politique de lecture publique
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'input-images');

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'output-images');

-- Politique d'upload
CREATE POLICY "Enable insert for authenticated users"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'input-images');

CREATE POLICY "Enable insert for authenticated users"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'output-images');
```

## 🎮 Utilisation

1. Démarrer le serveur de développement :
```bash
npm run dev
```

2. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

3. Utiliser l'application :
   - Cliquez pour sélectionner une image
   - Entrez un prompt décrivant la transformation souhaitée
   - Cliquez sur "Générer l'image"
   - Attendez la génération (cela peut prendre 20-30 secondes)
   - Téléchargez ou créez une nouvelle transformation

## 📦 Structure du projet

```
image_generator/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts      # API route pour la génération
│   ├── layout.tsx             # Layout principal
│   ├── page.tsx               # Page d'accueil avec formulaire
│   └── globals.css            # Styles globaux
├── .env.local                 # Variables d'environnement
├── next.config.js             # Configuration Next.js
├── tailwind.config.ts         # Configuration Tailwind
└── package.json               # Dépendances
```

## 🔧 Technologies utilisées

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Supabase** - Backend as a Service (BDD + Storage)
- **Replicate** - API d'IA pour la génération d'images
- **ControlNet** - Modèle d'IA pour la transformation d'images

## 🎨 Modèle IA utilisé

Le projet utilise le modèle **ControlNet Scribble** via Replicate :
- Modèle : `jagilley/controlnet-scribble`
- Résolution : 512x512
- Steps d'inférence : 20

## 🚀 Déploiement

Pour déployer en production :

```bash
npm run build
npm start
```

Ou déployez sur Vercel :
```bash
vercel deploy
```

N'oubliez pas de configurer les variables d'environnement sur votre plateforme de déploiement.

## 📝 Notes

- Les images sont stockées de manière permanente sur Supabase
- Chaque génération est sauvegardée dans la base de données
- Le temps de génération dépend de la charge des serveurs Replicate
- Les buckets doivent être configurés en mode public pour que les URLs fonctionnent

## 🐛 Dépannage

### Erreur "Bucket not found"
- Vérifiez que les buckets `input-images` et `output-images` existent dans Supabase
- Vérifiez que les buckets sont configurés en mode public

### Erreur "Table does not exist"
- Exécutez le SQL fourni ci-dessus pour créer la table `projects`

### Erreur d'authentification Replicate
- Vérifiez que votre token Replicate est valide dans `.env.local`

### Images ne s'affichent pas
- Vérifiez les politiques de storage dans Supabase
- Vérifiez que `next.config.js` autorise les domaines Supabase et Replicate

## 📄 Licence

MIT
