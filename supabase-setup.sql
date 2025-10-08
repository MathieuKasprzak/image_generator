-- =====================================================
-- Configuration Supabase pour l'éditeur d'images IA
-- =====================================================

-- 1. Créer la table projects
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  input_image_url TEXT NOT NULL,
  output_image_url TEXT,
  prompt TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- 2. Activer Row Level Security
-- =====================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 3. Créer les politiques pour la table projects
-- =====================================================
-- Politique pour permettre l'insertion
CREATE POLICY "Enable insert for all users" ON projects
  FOR INSERT WITH CHECK (true);

-- Politique pour permettre la lecture
CREATE POLICY "Enable read for all users" ON projects
  FOR SELECT USING (true);

-- 4. Créer un index pour améliorer les performances
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- =====================================================
-- Configuration des buckets de stockage
-- =====================================================
-- Note : Les buckets doivent être créés manuellement via l'interface Supabase
-- Créez les buckets suivants dans Storage :
-- 1. input-images (public)
-- 2. output-images (public)

-- =====================================================
-- Politiques de stockage pour input-images
-- =====================================================
-- Politique de lecture publique
CREATE POLICY "Public Access for input-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'input-images');

-- Politique d'upload pour tous les utilisateurs
CREATE POLICY "Enable insert for input-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'input-images');

-- =====================================================
-- Politiques de stockage pour output-images
-- =====================================================
-- Politique de lecture publique
CREATE POLICY "Public Access for output-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'output-images');

-- Politique d'upload pour tous les utilisateurs
CREATE POLICY "Enable insert for output-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'output-images');

-- =====================================================
-- Vues utiles (optionnel)
-- =====================================================
-- Vue pour les projets récents
CREATE OR REPLACE VIEW recent_projects AS
SELECT 
  id,
  created_at,
  input_image_url,
  output_image_url,
  prompt,
  status,
  CASE 
    WHEN status = 'completed' THEN 'Terminé'
    WHEN status = 'pending' THEN 'En attente'
    WHEN status = 'processing' THEN 'En cours'
    ELSE 'Erreur'
  END as status_fr
FROM projects
ORDER BY created_at DESC
LIMIT 100;

-- =====================================================
-- Fonction pour nettoyer les anciens projets (optionnel)
-- =====================================================
CREATE OR REPLACE FUNCTION cleanup_old_projects()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Supprime les projets de plus de 30 jours
  DELETE FROM projects 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;

-- =====================================================
-- Instructions d'utilisation
-- =====================================================
-- 1. Copiez tout ce fichier SQL
-- 2. Allez dans Supabase > SQL Editor
-- 3. Collez le SQL et exécutez-le
-- 4. Allez dans Storage et créez manuellement les buckets :
--    - input-images (cochez "Public bucket")
--    - output-images (cochez "Public bucket")
-- 5. Vérifiez que tout fonctionne en testant l'application
