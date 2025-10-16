// Types pour l'application d'éditeur d'images

export interface Project {
  id: string;
  created_at: string;
  input_image_url: string;
  output_image_url: string | null;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface GenerateRequest {
  image: File;
  prompt: string;
}

export interface GenerateResponse {
  success: boolean;
  outputImageUrl: string;
  inputImageUrl: string;
  projectId?: string;
}

export interface ErrorResponse {
  error: string;
}

export interface ReplicateInput {
  image: string;
  prompt: string;
  num_outputs?: number;
  image_resolution?: number;
  num_inference_steps?: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | null;
  current_period_end: string | null;
  quota_limit: number;
  quota_used: number;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionStatusResponse {
  subscription: Subscription | null;
  hasActiveSubscription: boolean;
  quotaUsed: number;
  quotaLimit: number;
}
