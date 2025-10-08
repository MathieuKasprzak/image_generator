# 🚀 Guide de Démarrage Rapide

## ⚡ Installation en 3 étapes

### 1. Les dépendances sont déjà installées ✅

### 2. Configuration Supabase

#### A. Créer les buckets de stockage

1. Allez sur [https://xwtyntoyitbbtspywfjg.supabase.co](https://xwtyntoyitbbtspywfjg.supabase.co)
2. Connectez-vous à votre projet
3. Allez dans **Storage** (menu de gauche)
4. Créez deux buckets :
   - **input-images** (cochez "Public bucket")
   - **output-images** (cochez "Public bucket")

#### B. Créer la table projects

1. Allez dans **SQL Editor** (menu de gauche)
2. Cliquez sur **New query**
3. Copiez-collez le contenu du fichier `supabase-setup.sql`
4. Cliquez sur **Run** ou appuyez sur `Cmd+Enter`

### 3. Lancer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur ! 🎉

## 🎨 Utilisation

1. **Upload** : Cliquez sur la zone pour sélectionner une image
2. **Prompt** : Décrivez la transformation (ex: "transforme en style aquarelle")
3. **Générer** : Cliquez sur le bouton "Générer l'image"
4. **Attendre** : La génération prend 20-30 secondes
5. **Télécharger** : Cliquez sur "Télécharger" pour sauvegarder le résultat

## 💡 Exemples de prompts

- "transform into a watercolor painting"
- "make it look like a pencil sketch"
- "convert to anime style"
- "make it look like a Van Gogh painting"
- "transform into a realistic photograph"
- "make it look like a comic book"

## 🐛 Problèmes courants

### Erreur "Bucket not found"
➡️ Les buckets n'existent pas encore. Créez-les via l'interface Supabase (étape 2A)

### Erreur "Table does not exist"
➡️ La table n'a pas été créée. Exécutez le SQL (étape 2B)

### Erreur 401 ou 403
➡️ Vérifiez que :
- Les buckets sont en mode **public**
- Les variables dans `.env.local` sont correctes

### L'image ne se génère pas
➡️ Vérifiez :
- Votre token Replicate est valide
- Vous avez des crédits sur votre compte Replicate
- La taille de l'image est raisonnable (< 10MB)

## 📊 Vérifier que tout fonctionne

1. **Buckets créés** : Storage > Vous devez voir `input-images` et `output-images`
2. **Table créée** : Table Editor > Vous devez voir la table `projects`
3. **Variables d'env** : Le fichier `.env.local` existe et contient les bonnes clés

## 🎯 Checklist de configuration

- [ ] npm install exécuté
- [ ] Bucket `input-images` créé (public)
- [ ] Bucket `output-images` créé (public)
- [ ] Table `projects` créée avec SQL
- [ ] Fichier `.env.local` configuré
- [ ] `npm run dev` fonctionne
- [ ] Page s'ouvre sur http://localhost:3000

## 📞 Besoin d'aide ?

Consultez le fichier `README.md` pour plus de détails sur la configuration et le dépannage.
