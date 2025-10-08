# 🗄️ Configuration Supabase - Guide Détaillé

## 📊 Vue d'ensemble

Ce guide vous accompagne pas à pas pour configurer votre projet Supabase.

---

## 1️⃣ Créer les Buckets de Stockage

### Étape 1 : Accéder au Storage

1. Connectez-vous à [https://xwtyntoyitbbtspywfjg.supabase.co](https://xwtyntoyitbbtspywfjg.supabase.co)
2. Dans le menu de gauche, cliquez sur **Storage**

### Étape 2 : Créer le bucket input-images

1. Cliquez sur **New bucket**
2. Remplissez :
   - **Name** : `input-images`
   - **Public bucket** : ✅ Coché
   - **File size limit** : 10 MB
3. Cliquez sur **Create bucket**

### Étape 3 : Créer le bucket output-images

1. Cliquez sur **New bucket**
2. Remplissez :
   - **Name** : `output-images`
   - **Public bucket** : ✅ Coché
   - **File size limit** : 10 MB
3. Cliquez sur **Create bucket**

### ✅ Vérification

Vous devriez maintenant voir deux buckets :
- 🗂️ input-images (public)
- 🗂️ output-images (public)

---

## 2️⃣ Configurer les Politiques de Stockage

### Méthode automatique (recommandée)

Les politiques seront créées automatiquement avec le fichier SQL à l'étape 3.

### Méthode manuelle (si nécessaire)

1. Dans **Storage**, cliquez sur un bucket
2. Allez dans l'onglet **Policies**
3. Cliquez sur **New policy**

#### Pour les lectures (SELECT)

```
Policy name: Public Access
Target roles: public
Policy definition: WITH CHECK (true)
```

#### Pour les uploads (INSERT)

```
Policy name: Enable insert for all
Target roles: public  
Policy definition: WITH CHECK (bucket_id = 'input-images')
```

Répétez pour `output-images`.

---

## 3️⃣ Créer la Table projects

### Étape 1 : Ouvrir SQL Editor

1. Dans le menu de gauche, cliquez sur **SQL Editor**
2. Cliquez sur **New query**

### Étape 2 : Copier le SQL

Ouvrez le fichier `supabase-setup.sql` et copiez tout son contenu.

### Étape 3 : Exécuter le SQL

1. Collez le SQL dans l'éditeur
2. Cliquez sur **Run** ou appuyez sur `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)

### ✅ Vérification

1. Allez dans **Table Editor**
2. Vous devriez voir la table **projects** avec les colonnes :
   - `id` (uuid)
   - `created_at` (timestamp)
   - `input_image_url` (text)
   - `output_image_url` (text)
   - `prompt` (text)
   - `status` (text)

---

## 4️⃣ Vérifier les Variables d'Environnement

### Vos clés actuelles

Elles sont déjà configurées dans `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xwtyntoyitbbtspywfjg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Trouver vos clés (si besoin)

1. Dans Supabase, allez dans **Settings** > **API**
2. Vous trouverez :
   - **Project URL** : Votre NEXT_PUBLIC_SUPABASE_URL
   - **anon public** : Votre NEXT_PUBLIC_SUPABASE_ANON_KEY
   - **service_role** : Votre SUPABASE_SERVICE_ROLE_KEY

---

## 5️⃣ Tester la Configuration

### Test des buckets

1. Dans **Storage**, sélectionnez `input-images`
2. Cliquez sur **Upload file**
3. Uploadez une image de test
4. Si ça fonctionne ✅, c'est bon !
5. Supprimez l'image de test

### Test de la base de données

1. Dans **Table Editor**, sélectionnez `projects`
2. Cliquez sur **Insert row**
3. Remplissez :
   ```
   input_image_url: test.jpg
   prompt: test prompt
   status: pending
   ```
4. Cliquez sur **Save**
5. Si la ligne apparaît ✅, c'est bon !
6. Supprimez la ligne de test

---

## 6️⃣ Configuration RLS (Sécurité)

La Row Level Security est déjà configurée par le fichier SQL.

### Vérifier RLS

1. Table Editor > projects
2. Cliquez sur l'icône 🔒 à côté de `projects`
3. **RLS enabled** devrait être ✅

### Politiques actives

Vous devriez voir :
- ✅ Enable insert for all users (INSERT)
- ✅ Enable read for all users (SELECT)

---

## 🎯 Checklist Finale

Avant de lancer l'application, vérifiez :

### Storage
- [ ] Bucket `input-images` existe et est public
- [ ] Bucket `output-images` existe et est public
- [ ] Politiques de lecture configurées
- [ ] Politiques d'upload configurées

### Database
- [ ] Table `projects` créée
- [ ] Colonnes correctes (id, created_at, input_image_url, output_image_url, prompt, status)
- [ ] RLS activé
- [ ] Politiques INSERT et SELECT configurées

### Variables
- [ ] `.env.local` existe
- [ ] NEXT_PUBLIC_SUPABASE_URL configurée
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY configurée
- [ ] SUPABASE_SERVICE_ROLE_KEY configurée

---

## 🚀 Lancer l'Application

Une fois tout configuré :

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

---

## 🐛 Dépannage

### "Bucket not found"
➡️ Les buckets n'existent pas ou ne sont pas publics

### "relation 'projects' does not exist"
➡️ La table n'a pas été créée, exécutez le SQL

### "Row level security policy violated"
➡️ Les politiques RLS ne sont pas configurées correctement

### "Invalid API key"
➡️ Vérifiez les clés dans `.env.local`

---

## 📞 Support

- Documentation Supabase : [https://supabase.com/docs](https://supabase.com/docs)
- Supabase Discord : [https://discord.supabase.com](https://discord.supabase.com)

---

## 🎉 Prêt !

Votre configuration Supabase est complète ! 

Vous pouvez maintenant :
1. Uploader des images
2. Les transformer avec l'IA
3. Les sauvegarder automatiquement
4. Voir l'historique dans la galerie
