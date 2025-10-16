import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { stripe, getPlanByPriceId } from '@/lib/stripe/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const supabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const supabaseAuth = await createClient();
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier si l'abonnement existe déjà dans la DB
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Si l'abonnement existe déjà et est actif, pas besoin de synchroniser
    if (existingSubscription && (existingSubscription.status === 'active' || existingSubscription.status === 'trialing')) {
      return NextResponse.json({
        success: true,
        message: 'Abonnement déjà synchronisé',
        subscription: existingSubscription,
      });
    }

    // Chercher l'abonnement sur Stripe
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Aucun customer Stripe trouvé',
      });
    }

    const customer = customers.data[0];
    
    // Récupérer les abonnements du customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Aucun abonnement actif trouvé sur Stripe',
      });
    }

    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0]?.price.id;
    const plan = getPlanByPriceId(priceId);

    // Créer ou mettre à jour l'abonnement dans Supabase
    const { data: upsertedSubscription, error: upsertError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        stripe_customer_id: customer.id,
        stripe_subscription_id: subscription.id,
        stripe_price_id: priceId,
        status: subscription.status,
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        quota_limit: plan?.quota || 50,
        quota_used: existingSubscription?.quota_used || 0,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (upsertError) {
      console.error('Error upserting subscription:', upsertError);
      return NextResponse.json({
        success: false,
        error: 'Erreur lors de la synchronisation',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Abonnement synchronisé avec succès',
      subscription: upsertedSubscription,
    });

  } catch (error) {
    console.error('Error syncing subscription:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la synchronisation',
      },
      { status: 500 }
    );
  }
}
