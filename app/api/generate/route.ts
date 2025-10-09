import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Replicate from 'replicate';
import { STORAGE_BUCKETS, REPLICATE_MODEL, DEFAULT_REPLICATE_CONFIG, STATUS } from '@/config/constants';
import { createClient as createServerClient } from '@/lib/supabase/server';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const supabaseServer = await createServerClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorisé. Veuillez vous connecter.' },
        { status: 401 }
      );
    }
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image et prompt requis' },
        { status: 400 }
      );
    }

    // 1. Upload the input image to Supabase
    console.log('Uploading input image to Supabase...');
    const timestamp = Date.now();
    const inputFileName = `input_${timestamp}_${image.name}`;
    const imageBuffer = await image.arrayBuffer();
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.INPUT)
      .upload(inputFileName, imageBuffer, {
        contentType: image.type,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: `Erreur d'upload: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 2. Get public URL of the uploaded input image
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKETS.INPUT)
      .getPublicUrl(inputFileName);

    const inputImageUrl = urlData.publicUrl;
    console.log('Input image URL:', inputImageUrl);

    // 3. Call Replicate API with the image URL
    console.log('Calling Replicate API...');
    const output = await replicate.run(
      REPLICATE_MODEL,
      {
        input: {
          image: inputImageUrl,
          prompt: prompt,
          ...DEFAULT_REPLICATE_CONFIG,
        },
      }
    ) as string[];

    if (!output || output.length === 0) {
      return NextResponse.json(
        { error: 'Aucune image générée par Replicate' },
        { status: 500 }
      );
    }

    const replicateImageUrl = output[0];
    console.log('Generated image URL from Replicate:', replicateImageUrl);

    // 4. Download the generated image from Replicate
    console.log('Downloading generated image...');
    const imageResponse = await fetch(replicateImageUrl);
    if (!imageResponse.ok) {
      throw new Error('Erreur lors du téléchargement de l\'image générée');
    }
    const generatedImageBuffer = await imageResponse.arrayBuffer();

    // 5. Upload the generated image to Supabase output-images bucket
    console.log('Uploading generated image to Supabase...');
    const outputFileName = `output_${timestamp}.png`;
    
    const { data: outputUploadData, error: outputUploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.OUTPUT)
      .upload(outputFileName, generatedImageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
      });

    if (outputUploadError) {
      console.error('Output upload error:', outputUploadError);
      return NextResponse.json(
        { error: `Erreur d'upload de l'image générée: ${outputUploadError.message}` },
        { status: 500 }
      );
    }

    // 6. Get public URL of the output image
    const { data: outputUrlData } = supabase.storage
      .from(STORAGE_BUCKETS.OUTPUT)
      .getPublicUrl(outputFileName);

    const outputImageUrl = outputUrlData.publicUrl;

    // 7. Save to database with user_id
    console.log('Saving to database...');
    const { data: projectData, error: dbError } = await supabase
      .from('projects')
      .insert([
        {
          user_id: user.id,
          input_image_url: inputImageUrl,
          output_image_url: outputImageUrl,
          prompt: prompt,
          status: STATUS.COMPLETED,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Don't fail the request if DB insert fails, image is already generated
    }

    // 8. Return the output image URL
    return NextResponse.json({
      success: true,
      outputImageUrl: outputImageUrl,
      inputImageUrl: inputImageUrl,
      projectId: projectData?.id,
    });

  } catch (error) {
    console.error('Error in generate API:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Erreur lors de la génération',
      },
      { status: 500 }
    );
  }
}
