#!/bin/bash

echo "🔍 DIAGNOSTIC SUPABASE - Vérification détaillée"
echo "================================================"
echo ""

# Test 1: Variables d'environnement
echo "1️⃣ Variables d'environnement:"
if [ -f ".env.local" ]; then
    echo "   ✅ .env.local existe"
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL=https://xwtyntoyitbbtspywfjg.supabase.co" .env.local; then
        echo "   ✅ NEXT_PUBLIC_SUPABASE_URL correcte"
    else
        echo "   ❌ NEXT_PUBLIC_SUPABASE_URL incorrecte ou manquante"
    fi
    
    if grep -q "SUPABASE_SERVICE_ROLE_KEY=" .env.local; then
        echo "   ✅ SUPABASE_SERVICE_ROLE_KEY présente"
    else
        echo "   ❌ SUPABASE_SERVICE_ROLE_KEY manquante"
    fi
else
    echo "   ❌ .env.local n'existe pas"
fi

echo ""
echo "2️⃣ Contenu complet de .env.local:"
echo "-----------------------------------"
cat .env.local
echo "-----------------------------------"

echo ""
echo "3️⃣ Test de connexion à Supabase:"
echo "   URL: https://xwtyntoyitbbtspywfjg.supabase.co"
curl -s -o /dev/null -w "   Status HTTP: %{http_code}\n" https://xwtyntoyitbbtspywfjg.supabase.co

echo ""
echo "4️⃣ Instructions de vérification manuelle:"
echo ""
echo "   Sur Supabase Dashboard:"
echo "   1. Allez dans Storage"
echo "   2. Vérifiez que vous voyez:"
echo "      - input-images (avec icône 🌐 = public)"
echo "      - output-images (avec icône 🌐 = public)"
echo ""
echo "   3. Cliquez sur input-images"
echo "   4. Allez dans 'Policies' (onglet)"
echo "   5. Vérifiez qu'il y a des policies actives"
echo ""
echo "   4. Si les buckets existent mais pas de policies:"
echo "      → Allez dans SQL Editor"
echo "      → Exécutez le fichier supabase-setup.sql"
echo ""

echo "5️⃣ Test de création de fichier (simulation):"
echo "   Les buckets doivent accepter les uploads..."
echo "   Vérifiez dans Supabase > Storage > Policies"

echo ""
echo "================================================"
echo "💡 Actions recommandées:"
echo ""
echo "   A. Vérifier les policies des buckets:"
echo "      → Storage > input-images > Policies"
echo "      → Doit avoir au moins 1 policy active"
echo ""
echo "   B. Si pas de policies, exécuter le SQL:"
echo "      → SQL Editor > New query"
echo "      → Copier supabase-setup.sql"
echo "      → Run"
echo ""
echo "   C. Redémarrer l'application:"
echo "      → Ctrl+C dans le terminal"
echo "      → npm run dev"
echo ""
