import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { STORAGE_BUCKETS } from '@/config/constants';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    const supabaseServer = await createServerClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Récupérer le projet pour vérifier qu'il appartient à l'utilisateur
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !project) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    // Extraire les noms de fichiers des URLs
    const extractFilename = (url: string) => {
      const parts = url.split('/');
      return parts[parts.length - 1];
    };

    // Supprimer les images des buckets
    try {
      if (project.input_image_url) {
        const inputFilename = extractFilename(project.input_image_url);
        await supabase.storage
          .from(STORAGE_BUCKETS.INPUT)
          .remove([inputFilename]);
      }

      if (project.output_image_url) {
        const outputFilename = extractFilename(project.output_image_url);
        await supabase.storage
          .from(STORAGE_BUCKETS.OUTPUT)
          .remove([outputFilename]);
      }
    } catch (storageError) {
      console.error('Error deleting from storage:', storageError);
      // Continue même en cas d'erreur de suppression des fichiers
    }

    // Supprimer le projet de la base de données
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in delete API:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
