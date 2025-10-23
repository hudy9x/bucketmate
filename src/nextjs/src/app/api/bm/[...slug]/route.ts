import { createBucketmateNextHandler } from '@bucketmate/nextjs';
import type { BucketClientConfig } from '@bucketmate/client';

const readEnv = (k: string, f?: string) => {
  const v = process.env[k];
  if (typeof v === 'string' && v.length) return v;
  if (f !== undefined) return f;
  throw new Error(`BucketmateNext: missing env ${k}`);
};

const cfg: BucketClientConfig = {
  provider: 'r2',
  endpoint: readEnv('R2_ENDPOINT'),
  region: readEnv('R2_REGION', 'auto'),
  bucket: readEnv('R2_BUCKET_NAME'),
  accessKeyId: readEnv('R2_ACCESS_KEY'),
  secretAccessKey: readEnv('R2_SECRET_KEY')
};

const bucketmateHandler = createBucketmateNextHandler(cfg);

const normalize = (ctx: any) => ({ params: { slug: typeof ctx?.params?.slug === 'string' ? [ctx.params.slug] : Array.isArray(ctx?.params?.slug) ? ctx.params.slug : [] } });

const handle = (req: Request, ctx: any) => bucketmateHandler(req as any, normalize(ctx) as any);

export { handle as GET, handle as POST, handle as DELETE };
