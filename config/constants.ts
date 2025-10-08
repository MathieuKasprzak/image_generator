// Configuration constants for the application

export const STORAGE_BUCKETS = {
  INPUT: 'input_image',
  OUTPUT: 'output_image',
} as const;

export const REPLICATE_MODEL = 'jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117';

export const DEFAULT_REPLICATE_CONFIG = {
  num_outputs: 1,
  image_resolution: 512,
  num_inference_steps: 20,
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;
