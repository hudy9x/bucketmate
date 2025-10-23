import { createBucketmateNextHandler } from '@bucketmate/nextjs';
import type { BucketClientConfig } from '@bucketmate/client';

function readEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  if (fallback !== undefined) {
    return fallback;
  }
  throw new Error(`BucketmateNext: missing required environment variable "${key}"`);
}

function buildBucketmateConfig(): BucketClientConfig {
  return {
    provider: 'r2',
    endpoint: readEnv('R2_ENDPOINT'),
    region: readEnv('R2_REGION', 'auto'),
    bucket: readEnv('R2_BUCKET_NAME'),
    accessKeyId: readEnv('R2_ACCESS_KEY'),
    secretAccessKey: readEnv('R2_SECRET_KEY')
  };
}

const bucketmateHandler = createBucketmateNextHandler(buildBucketmateConfig());

function normalizeContext(context: any) {
  const raw = context?.params?.slug
  const slug = typeof raw === 'string' ? [raw] : Array.isArray(raw) ? raw : []
  return { params: { slug } }
}

export function GET(request: Request, context: any) {
  return bucketmateHandler(request as any, normalizeContext(context) as any)
}
export function POST(request: Request, context: any) {
  return bucketmateHandler(request as any, normalizeContext(context) as any)
}
export function DELETE(request: Request, context: any) {
  return bucketmateHandler(request as any, normalizeContext(context) as any)
}
