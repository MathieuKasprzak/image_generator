// Configuration constants for the application

export const STORAGE_BUCKETS = {
  INPUT: 'input_image',
  OUTPUT: 'output_image',
} as const;

export const REPLICATE_MODEL = 'google/nano-banana';

export const DEFAULT_REPLICATE_CONFIG = {
  num_outputs: 1,
  // Configuration spécifique pour nano-banana
  // Le modèle accepte 'image' et 'prompt' comme paramètres principaux
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const STRIPE_PRICE_IDS = {
  BASIC: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC || 'price_1SIqT23f3KoZz590nJflR6ZU',
  PRO: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || 'price_1SIqVw3f3KoZz590boFjfscn',
} as const;
