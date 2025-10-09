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
