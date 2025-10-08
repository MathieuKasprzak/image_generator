// Test de connexion Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Test de connexion Supabase\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? '✅ Présente' : '❌ Manquante');
console.log('');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBuckets() {
  console.log('📦 Test des buckets...\n');
  
  try {
    // Lister tous les buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Erreur:', error.message);
      return;
    }
    
    console.log('✅ Buckets trouvés:', buckets.length);
    console.log('');
    
    buckets.forEach(bucket => {
      console.log(`  📁 ${bucket.name}`);
      console.log(`     ID: ${bucket.id}`);
      console.log(`     Public: ${bucket.public ? '✅ Oui' : '❌ Non'}`);
      console.log(`     Created: ${bucket.created_at}`);
      console.log('');
    });
    
    // Vérifier si nos buckets existent
    const hasInputImages = buckets.find(b => b.name === 'input_image');
    const hasOutputImages = buckets.find(b => b.name === 'output_image');
    
    console.log('🔍 Vérification des buckets requis:');
    console.log(`  input_image: ${hasInputImages ? '✅ Trouvé' : '❌ Manquant'}`);
    console.log(`  output_image: ${hasOutputImages ? '✅ Trouvé' : '❌ Manquant'}`);
    console.log('');
    
    if (!hasInputImages || !hasOutputImages) {
      console.log('⚠️  Les buckets requis sont manquants !');
      console.log('');
      console.log('📝 Action requise:');
      console.log('   1. Allez sur Storage dans Supabase');
      console.log('   2. Créez les buckets manquants (publics)');
      console.log('   3. Relancez ce test');
    } else {
      console.log('✅ Tous les buckets requis sont présents !');
      
      // Test d'upload
      console.log('');
      console.log('🧪 Test d\'upload dans input_image...');
      
      const testFile = new Blob(['test'], { type: 'text/plain' });
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('input_image')
        .upload('test-file.txt', testFile);
      
      if (uploadError) {
        console.log('❌ Erreur d\'upload:', uploadError.message);
        console.log('');
        console.log('📝 Cela signifie que les policies ne sont pas configurées.');
        console.log('   → Exécutez supabase-setup.sql dans SQL Editor');
      } else {
        console.log('✅ Upload réussi !');
        
        // Nettoyer
        await supabase.storage
          .from('input_image')
          .remove(['test-file.txt']);
        
        console.log('✅ Test nettoyé');
        console.log('');
        console.log('🎉 Configuration Supabase parfaite !');
      }
    }
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }
}

testBuckets();
