// Test simple pour vérifier l'authentification Replicate
const Replicate = require('replicate').default;
require('dotenv').config({ path: '.env.local' });

console.log('Token depuis .env.local:', process.env.REPLICATE_API_TOKEN);
console.log('Token présent:', !!process.env.REPLICATE_API_TOKEN);

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Test simple: lister les modèles
replicate.models.list()
  .then(models => {
    console.log('✅ Authentification réussie!');
    console.log('Nombre de modèles:', models.results.length);
  })
  .catch(error => {
    console.log('❌ Erreur:', error.message);
    console.log('Détails:', error);
  });
