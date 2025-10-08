#!/bin/bash

# Script de vérification de la configuration
# Usage: ./check-setup.sh

echo "🔍 Vérification de la configuration..."
echo ""

# Vérifier Node.js
echo "📦 Node.js:"
if command -v node &> /dev/null; then
    echo "   ✅ Node.js installé ($(node --version))"
else
    echo "   ❌ Node.js non installé"
fi

# Vérifier npm
echo ""
echo "📦 npm:"
if command -v npm &> /dev/null; then
    echo "   ✅ npm installé ($(npm --version))"
else
    echo "   ❌ npm non installé"
fi

# Vérifier node_modules
echo ""
echo "📁 Dépendances:"
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules existe"
else
    echo "   ❌ node_modules manquant - Exécutez 'npm install'"
fi

# Vérifier .env.local
echo ""
echo "🔐 Variables d'environnement:"
if [ -f ".env.local" ]; then
    echo "   ✅ .env.local existe"
    
    # Vérifier les variables requises
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "   ✅ NEXT_PUBLIC_SUPABASE_URL configuré"
    else
        echo "   ❌ NEXT_PUBLIC_SUPABASE_URL manquant"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo "   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configuré"
    else
        echo "   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY manquant"
    fi
    
    if grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
        echo "   ✅ SUPABASE_SERVICE_ROLE_KEY configuré"
    else
        echo "   ❌ SUPABASE_SERVICE_ROLE_KEY manquant"
    fi
    
    if grep -q "REPLICATE_API_TOKEN" .env.local; then
        echo "   ✅ REPLICATE_API_TOKEN configuré"
    else
        echo "   ❌ REPLICATE_API_TOKEN manquant"
    fi
else
    echo "   ❌ .env.local manquant - Copiez .env.example vers .env.local"
fi

# Vérifier la structure des dossiers
echo ""
echo "📂 Structure du projet:"
if [ -d "app" ]; then
    echo "   ✅ Dossier app/ existe"
else
    echo "   ❌ Dossier app/ manquant"
fi

if [ -d "components" ]; then
    echo "   ✅ Dossier components/ existe"
else
    echo "   ❌ Dossier components/ manquant"
fi

if [ -f "app/page.tsx" ]; then
    echo "   ✅ app/page.tsx existe"
else
    echo "   ❌ app/page.tsx manquant"
fi

if [ -f "app/api/generate/route.ts" ]; then
    echo "   ✅ API route existe"
else
    echo "   ❌ API route manquante"
fi

echo ""
echo "📋 Résumé:"
echo "   Pour lancer l'application: npm run dev"
echo "   URL: http://localhost:3000"
echo ""
echo "⚠️  N'oubliez pas de configurer Supabase:"
echo "   1. Créez les buckets input-images et output-images"
echo "   2. Exécutez le SQL dans supabase-setup.sql"
echo ""
