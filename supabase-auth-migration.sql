-- =====================================================
-- MIGRATION: Ajouter l'authentification au projet
-- =====================================================

-- 1. Ajouter la colonne user_id à la table projects
-- =====================================================
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Créer un index sur user_id pour améliorer les performances
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);

-- 3. Mettre à jour les politiques RLS
-- =====================================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Enable insert for all users" ON projects;
DROP POLICY IF EXISTS "Enable read for all users" ON projects;

-- Nouvelle politique pour l'insertion (utilisateurs authentifiés uniquement)
CREATE POLICY "Enable insert for authenticated users" ON projects
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Nouvelle politique pour la lecture (utilisateurs peuvent voir leurs propres projets)
CREATE POLICY "Enable read for own projects" ON projects
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Politique pour la suppression (utilisateurs peuvent supprimer leurs propres projets)
CREATE POLICY "Enable delete for own projects" ON projects
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Politique pour la mise à jour (utilisateurs peuvent modifier leurs propres projets)
CREATE POLICY "Enable update for own projects" ON projects
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. Configurer l'authentification par email
-- =====================================================
-- Cela se fait via l'interface Supabase :
-- Authentication > Settings > Enable Email provider

-- =====================================================
-- 5. Optionnel : Créer une fonction pour nettoyer les projets
-- =====================================================
CREATE OR REPLACE FUNCTION delete_user_projects()
RETURNS TRIGGER AS $$
BEGIN
  -- Les projets seront automatiquement supprimés via ON DELETE CASCADE
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Notes importantes
-- =====================================================
-- 1. La colonne user_id est maintenant requise pour tous les nouveaux projets
-- 2. Les anciennes données sans user_id ne seront pas visibles (policies RLS)
-- 3. Si vous avez des projets existants, vous pouvez :
--    a) Les supprimer : DELETE FROM projects WHERE user_id IS NULL;
--    b) Les assigner à un utilisateur test
-- 4. L'authentification par email doit être activée dans Supabase Dashboard
