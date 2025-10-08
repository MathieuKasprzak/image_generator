# 🎓 Tutoriel Complet - Premier Lancement

## 🎯 Objectif
Ce tutoriel vous guide pas à pas pour votre première génération d'image.

---

## Partie 1 : Configuration Initiale (5-10 minutes)

### Étape 1 : Vérifier l'installation

Ouvrez votre terminal dans le dossier du projet et tapez :

```bash
npm run check
```

**Résultat attendu :**
```
✅ Node.js installé
✅ npm installé  
✅ node_modules existe
✅ .env.local existe
✅ Toutes les variables configurées
✅ Structure du projet OK
```

Si tout est ✅, passez à l'étape 2.
Sinon, exécutez : `npm install`

---

### Étape 2 : Configurer Supabase (IMPORTANT !)

#### 2.1 Se connecter à Supabase

1. Ouvrez : [https://xwtyntoyitbbtspywfjg.supabase.co](https://xwtyntoyitbbtspywfjg.supabase.co)
2. Connectez-vous avec vos identifiants Supabase

#### 2.2 Créer les buckets

**Bucket 1 : input-images**
```
Storage (menu gauche)
  → New bucket
    → Name: input-images
    → ✅ Public bucket
    → Create bucket
```

**Bucket 2 : output-images**
```
Storage (menu gauche)
  → New bucket
    → Name: output-images
    → ✅ Public bucket
    → Create bucket
```

**Vérification :** Vous devez voir 2 buckets dans Storage

#### 2.3 Créer la base de données

```
SQL Editor (menu gauche)
  → New query
  → Copier le contenu de supabase-setup.sql
  → Coller dans l'éditeur
  → Run (ou Cmd+Enter)
```

**Vérification :** 
```
Table Editor (menu gauche)
  → Vous devez voir la table "projects"
```

---

### Étape 3 : Vérifier Replicate

Vérifiez que vous avez des crédits :

1. Allez sur : [https://replicate.com/account/billing](https://replicate.com/account/billing)
2. Vérifiez votre balance
3. Si nécessaire, ajoutez des crédits (minimum $5)

**Note :** Chaque génération coûte environ $0.006

---

## Partie 2 : Premier Lancement (2 minutes)

### Étape 4 : Démarrer l'application

Dans votre terminal :

```bash
npm run dev
```

**Résultat attendu :**
```
▲ Next.js 14.1.0
- Local:        http://localhost:3000
- ready started server on 0.0.0.0:3000
```

### Étape 5 : Ouvrir l'application

1. Ouvrez votre navigateur
2. Allez sur : [http://localhost:3000](http://localhost:3000)

**Vous devriez voir :**
- Un titre "Éditeur d'Images IA"
- Une zone d'upload d'image
- Un champ de texte pour le prompt
- Un bouton "Générer l'image"

---

## Partie 3 : Première Génération (1-2 minutes)

### Étape 6 : Préparer une image

**Options :**

A. Utiliser une image de test :
   - Téléchargez une image depuis Unsplash.com
   - Ou utilisez une photo de votre ordinateur

B. Recommandations :
   - Format : JPG ou PNG
   - Taille : < 5 MB
   - Dimensions : 512x512 à 1024x1024 idéal

### Étape 7 : Upload de l'image

1. Cliquez sur la zone "Cliquez pour choisir une image"
2. Sélectionnez votre image
3. L'image apparaît en prévisualisation

**Vérification :** L'image s'affiche sous la zone d'upload

---

### Étape 8 : Écrire un prompt

Dans le champ de texte, essayez l'un de ces prompts :

**Prompts artistiques :**
```
transform into a beautiful watercolor painting
make it look like a Van Gogh painting
convert to anime style art
make it look like a pencil sketch
transform into a cyberpunk style
```

**Prompts créatifs :**
```
add dramatic sunset lighting
make it look like it's in the rain
transform into a futuristic city
add magical fantasy elements
make it look like a vintage photograph
```

**Pour ce test, utilisez :**
```
transform into a beautiful watercolor painting
```

---

### Étape 9 : Générer !

1. Cliquez sur le bouton "✨ Générer l'image"
2. Attendez (20-30 secondes)

**Vous verrez :**
1. "Upload de l'image en cours..." (2-3s)
2. "Génération de l'image avec l'IA..." (20-30s)
3. L'image générée apparaît en dessous

**Indicateurs visuels :**
- ⏳ Animation de chargement
- 📝 Messages de statut
- ✅ Image finale affichée

---

## Partie 4 : Résultats et Actions (1 minute)

### Étape 10 : Voir le résultat

Une fois la génération terminée :

**Vous pouvez :**
1. 📥 **Télécharger** : Cliquer sur "Télécharger"
2. 🔄 **Recommencer** : Cliquer sur "Nouvelle image"
3. 🖼️ **Voir la galerie** : Cliquer sur "Voir la galerie" en haut

---

### Étape 11 : Explorer la galerie

1. Cliquez sur "Voir la galerie" en haut à droite
2. Vous verrez votre génération avec :
   - Image originale (à gauche)
   - Image générée (à droite)
   - Le prompt utilisé
   - La date de création

**Actions disponibles :**
- Télécharger l'image
- Voir en plein écran
- Retour à l'accueil

---

## Partie 5 : Vérification Technique (Optionnel)

### Étape 12 : Vérifier le stockage Supabase

1. Retournez sur Supabase Dashboard
2. Allez dans **Storage**
3. Vérifiez :
   - `input-images` → Votre image originale ✅
   - `output-images` → Votre image générée ✅

### Étape 13 : Vérifier la base de données

1. Dans Supabase, allez dans **Table Editor**
2. Sélectionnez la table **projects**
3. Vous devriez voir votre génération avec :
   - ✅ input_image_url
   - ✅ output_image_url
   - ✅ prompt
   - ✅ status: "completed"

---

## 🎉 Félicitations !

Vous avez réussi votre première génération !

**Vous savez maintenant :**
- ✅ Configurer Supabase
- ✅ Uploader une image
- ✅ Générer avec l'IA
- ✅ Télécharger le résultat
- ✅ Voir l'historique

---

## 🚀 Aller Plus Loin

### Expérimentez avec différents prompts

**Style artistique :**
- "in the style of Monet"
- "as a comic book illustration"
- "as a realistic photograph"

**Modifications :**
- "add dramatic lighting"
- "make it look futuristic"
- "add fantasy elements"

**Ambiance :**
- "at sunset"
- "in winter"
- "at night with city lights"

### Testez différents types d'images

1. **Paysages** → Transformations spectaculaires
2. **Portraits** → Styles artistiques
3. **Objets** → Concepts créatifs
4. **Architecture** → Visions futuristes

---

## 🐛 Problèmes Courants

### L'image ne se génère pas

**Vérifiez :**
1. Les buckets Supabase existent et sont publics
2. La table `projects` existe
3. Votre token Replicate est valide
4. Vous avez des crédits Replicate

**Solution rapide :**
```bash
./check-setup.sh
```

### Erreur "Bucket not found"

**Solution :**
Recréez les buckets dans Supabase Storage

### Erreur "Table does not exist"

**Solution :**
Ré-exécutez le SQL dans SQL Editor

### Timeout

**Causes possibles :**
- Connexion lente
- Image trop grande
- Surcharge Replicate

**Solution :**
- Réessayez
- Utilisez une image plus petite

---

## 📊 Monitoring

### Voir les logs en temps réel

**Terminal où tourne npm run dev :**
```
✓ Compiled /api/generate/route in 523ms
POST /api/generate 200 in 25431ms
```

**Logs Supabase :**
```
Supabase Dashboard > Logs > API
```

**Logs Replicate :**
```
https://replicate.com/predictions
```

---

## 💡 Conseils Pro

### Pour de meilleurs résultats

1. **Prompts clairs** : Soyez spécifique
   - ❌ "make it nice"
   - ✅ "transform into a watercolor painting with soft pastel colors"

2. **Images de qualité** : 
   - Bonne résolution (> 512px)
   - Bien éclairée
   - Sujet clair

3. **Expérimentation** :
   - Testez plusieurs prompts
   - Variez les styles
   - Comparez les résultats

### Optimiser les coûts

1. Testez avec peu d'images au début
2. Gardez `num_inference_steps` à 20 (défaut)
3. Utilisez des images raisonnables (< 1024px)
4. Configurez des limites de dépenses sur Replicate

---

## 🎯 Prochaines Étapes

**Maintenant que ça fonctionne :**

1. ✅ Créez plus d'images
2. ✅ Explorez différents prompts
3. ✅ Partagez vos résultats
4. ✅ Personnalisez l'interface
5. ✅ Déployez en production (voir DEPLOYMENT.md)

---

## 📚 Documentation Complète

Pour plus d'informations :

- **README.md** : Vue d'ensemble du projet
- **QUICKSTART.md** : Guide de démarrage rapide
- **SUPABASE_SETUP.md** : Configuration détaillée Supabase
- **DEPLOYMENT.md** : Guide de déploiement
- **COMMANDS.md** : Toutes les commandes utiles
- **IMPORTANT.md** : Notes importantes

---

## 🎊 Bravo !

Vous maîtrisez maintenant l'éditeur d'images IA !

**Amusez-vous bien ! 🚀**
