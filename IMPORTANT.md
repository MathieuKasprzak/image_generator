# ⚠️ NOTES IMPORTANTES

## 🔐 Sécurité

### Variables d'environnement
- ✅ Le fichier `.env.local` est déjà configuré avec vos clés
- ⚠️ **NE PARTAGEZ JAMAIS** ces clés publiquement
- ⚠️ Le fichier `.env.local` est dans `.gitignore` et ne sera pas commité
- ⚠️ Si vous commitez sur GitHub, vérifiez que `.env.local` n'est PAS inclus

### Clés API sensibles
Votre fichier `.env.local` contient :
- 🔑 Service Role Key Supabase (accès complet à la BDD)
- 🔑 Token Replicate (utilisé pour facturation)

### Que faire si vos clés sont exposées ?
1. **Supabase** : Settings > API > Reset service role key
2. **Replicate** : Account > API Tokens > Revoke & Create new
3. Mettez à jour `.env.local` avec les nouvelles clés

---

## 💰 Coûts

### Replicate
- Replicate facture à l'utilisation
- Le modèle ControlNet coûte environ **$0.0065 par génération**
- Vérifiez vos crédits : https://replicate.com/account/billing
- Configurez des limites de dépenses pour éviter les surprises

### Supabase
- **Plan gratuit** :
  - 500 MB de stockage
  - 50 GB de bande passante
  - Base de données jusqu'à 500 MB
- Les buckets sont en mode **public** = comptent dans la bande passante
- Surveillez votre usage : Project Settings > Usage

### Estimation mensuelle (100 générations/mois)
- Replicate : ~$0.65
- Supabase : Gratuit (sous les limites)
- **Total** : <$1/mois pour usage léger

---

## 🚨 Limitations Connues

### Supabase Storage
- Taille max par fichier : **10 MB** (configurable)
- Formats supportés : JPG, PNG, GIF, WebP
- Les buckets publics consomment plus de bande passante

### Replicate API
- Timeout : **~60 secondes** max par génération
- Rate limiting : Dépend de votre plan
- Résolution max : **512x512** (configurable dans le code)
- Temps de génération : **20-30 secondes** en moyenne

### Next.js/Vercel
- **Serverless Functions** :
  - Timeout : 10s (Hobby), 60s (Pro)
  - Taille max body : 4.5 MB
- Pour les longues générations, considérez :
  - Webhooks
  - Background jobs
  - Queue system

---

## 🔧 Configuration Importante

### Modèle Replicate
Le projet utilise actuellement : `jagilley/controlnet-scribble`

Pour changer de modèle :
1. Éditez `config/constants.ts`
2. Changez `REPLICATE_MODEL`
3. Ajustez les paramètres dans `DEFAULT_REPLICATE_CONFIG`

### Autres modèles disponibles
- `stability-ai/sdxl` - Plus haute qualité mais plus lent
- `bytedance/sdxl-lightning-4step` - Plus rapide
- Explorez : https://replicate.com/explore

---

## 📊 Base de Données Supabase

### Structure de la table projects
```sql
id                 UUID (PK)
created_at         TIMESTAMP
input_image_url    TEXT
output_image_url   TEXT
prompt             TEXT
status             TEXT ('pending', 'processing', 'completed', 'failed')
```

### Maintenance recommandée
- Nettoyez les anciens projets régulièrement
- Supprimez les images orphelines dans Storage
- Monitorer la taille de la BDD

### Script de nettoyage (à exécuter manuellement)
```sql
-- Supprimer les projets de plus de 30 jours
DELETE FROM projects 
WHERE created_at < NOW() - INTERVAL '30 days';
```

---

## 🎯 Workflow de Génération

### Processus complet
1. **Upload** → Image uploadée vers `input-images`
2. **URL publique** → Récupération de l'URL
3. **Replicate** → Envoi vers l'API avec prompt
4. **Génération** → IA traite l'image (20-30s)
5. **Download** → Téléchargement de l'image générée
6. **Upload** → Image générée vers `output-images`
7. **Database** → Sauvegarde des URLs + prompt
8. **Response** → Retour de l'URL finale

### Où ça peut échouer ?
1. ❌ Upload : Fichier trop gros, bucket n'existe pas
2. ❌ Replicate : Token invalide, pas de crédits, timeout
3. ❌ Download : URL expirée, problème réseau
4. ❌ Database : Permissions, table n'existe pas

---

## 🐛 Problèmes Courants

### "Bucket not found"
```bash
# Vérifiez que les buckets existent
# Supabase > Storage > Vous devez voir :
# - input-images ✅
# - output-images ✅
```

### "Invalid API token"
```bash
# Vérifiez votre token Replicate
cat .env.local | grep REPLICATE

# Testez-le
curl -H "Authorization: Token YOUR_TOKEN" \
  https://api.replicate.com/v1/models
```

### "Table does not exist"
```bash
# Exécutez le SQL de setup
# Supabase > SQL Editor > Coller supabase-setup.sql
```

### "504 Gateway Timeout"
```bash
# La génération prend trop de temps
# Solutions :
# 1. Réduire num_inference_steps dans constants.ts
# 2. Utiliser un modèle plus rapide
# 3. Implémenter des webhooks
```

---

## 📱 Responsive Design

L'interface est optimisée pour :
- ✅ Desktop (1920x1080)
- ✅ Laptop (1440x900)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

### Test sur différents devices
```bash
npm run dev
# Puis ouvrez dans Chrome et utilisez DevTools (F12)
# Toggle device toolbar (Cmd+Shift+M)
```

---

## 🎨 Personnalisation

### Couleurs
Les couleurs principales sont dans `tailwind.config.ts` :
- Purple : #9333ea (`purple-600`)
- Blue : #2563eb (`blue-600`)

### Changer le thème
1. Éditez `app/globals.css`
2. Modifiez les variables CSS `--background` et `--foreground`
3. Changez les classes Tailwind dans les composants

---

## 🔄 Mise à Jour

### Mettre à jour les dépendances
```bash
# Vérifier les mises à jour
npm outdated

# Mettre à jour (avec prudence)
npm update

# Ou pour les majeures
npm install package@latest
```

### Après une mise à jour
```bash
rm -rf .next
npm run build
npm run dev
```

---

## 📈 Améliorations Futures Suggérées

### Court terme
- [ ] Système de queue pour les générations
- [ ] Progress bar en temps réel
- [ ] Prévisualisation avant génération
- [ ] Support de plus de formats d'image

### Moyen terme
- [ ] Authentification utilisateur
- [ ] Système de crédits
- [ ] Historique par utilisateur
- [ ] Partage social

### Long terme
- [ ] API publique
- [ ] Marketplace de prompts
- [ ] Édition d'images avancée
- [ ] Support de vidéos

---

## 📞 Support et Ressources

### Documentation
- README.md - Vue d'ensemble
- QUICKSTART.md - Démarrage rapide
- SUPABASE_SETUP.md - Configuration Supabase
- DEPLOYMENT.md - Guide de déploiement
- COMMANDS.md - Commandes utiles

### Liens Utiles
- **Supabase Dashboard** : https://xwtyntoyitbbtspywfjg.supabase.co
- **Replicate Billing** : https://replicate.com/account/billing
- **Next.js Docs** : https://nextjs.org/docs

### Communautés
- Next.js Discord : https://discord.gg/nextjs
- Supabase Discord : https://discord.supabase.com
- Stack Overflow : #nextjs #supabase #replicate

---

## ✅ Checklist Avant Production

- [ ] Tester upload avec différents formats
- [ ] Tester génération avec différents prompts
- [ ] Vérifier la galerie s'affiche correctement
- [ ] Tester le dark mode
- [ ] Tester sur mobile
- [ ] Vérifier les logs d'erreurs
- [ ] Configurer un domaine personnalisé
- [ ] Configurer SSL
- [ ] Monitorer les coûts
- [ ] Configurer des alertes (usage/coûts)

---

## 🎉 Vous êtes Prêt !

Le projet est complet et prêt à l'emploi. 

**N'oubliez pas de :**
1. ✅ Créer les buckets sur Supabase
2. ✅ Exécuter le SQL pour créer la table
3. ✅ Vérifier que `.env.local` est configuré
4. ✅ Lancer `npm run dev`

**Bon développement ! 🚀**
