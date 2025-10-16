import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer l'abonnement de l'utilisateur
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching subscription:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de l\'abonnement' },
        { status: 500 }
      );
    }

    // Si pas d'abonnement, retourner un objet vide avec un quota par défaut
    if (!subscription) {
      return NextResponse.json({
        subscription: null,
        hasActiveSubscription: false,
        quotaUsed: 0,
        quotaLimit: 0,
      });
    }

    const hasActiveSubscription = subscription.status === 'active' || subscription.status === 'trialing';

    return NextResponse.json({
      subscription,
      hasActiveSubscription,
      quotaUsed: subscription.quota_used,
      quotaLimit: subscription.quota_limit,
    });
  } catch (error) {
    console.error('Error in subscription status:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
