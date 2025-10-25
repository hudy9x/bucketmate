# @bucketmate/nextjs

Adapter package to wire BucketMate providers with Next.js (v15 App Router) and Next.js 16 App Router compatibility notes.

## Features
- Simple, typed API to configure multiple providers (r2, minio, do, s3)
- Lightweight route handlers compatible with Next.js App Router
- Publishable as an npm package

## Install
- Using npm
  - `cd packages/nextjs`
  - `npm install`
  - `npm pack` // optional to verify before publish
- Using pnpm (workspace aware)
  - `pnpm install` (from repo root)

## Build
- `pnpm -w run build` (builds all workspace packages, including this one)

## Usage (Next.js App Router)
This package exposes a small API to create a route handler that dispatches to the correct bucket provider based on the request path. Wire it into your Next.js app using App Router API routes. The API is compatible with both v15 and v16 App Router patterns.

### Quick example (TypeScript)
```ts
// File: apps/nextjs-app/app/api/bucketmate/route.ts
import { createBucketmateNextHandler, toNextJsHandler } from '@bucketmate/nextjs';
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

// wrap the handler for Next.js App Router and export method handlers
const handler = toNextJsHandler(createBucketmateNextHandler(cfg));

export const { GET, POST, DELETE } = handler;
```

- The above demonstrates wiring for four providers. You can tailor the env vars or migrate to a config object from your own runtime.

### Project structure (example)
- apps/nextjs-app/
  - app/
    - api/
      - bucketmate/
        - route.ts
  - package.json

## Environment variables (example)
- R2_ENDPOINT, R2_REGION, R2_BUCKET_NAME, R2_ACCESS_KEY, R2_SECRET_KEY
- MINIO_ENDPOINT, MINIO_REGION, MINIO_BUCKET_NAME, MINIO_ACCESS_KEY, MINIO_SECRET_KEY
- DO_ENDPOINT, DO_REGION, DO_BUCKET_NAME, DO_ACCESS_KEY, DO_SECRET_KEY
- AWS_S3_ENDPOINT, AWS_REGION, AWS_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY

## Publishing
- Build: `pnpm -w run build`
- Publish (workspace aware):
  - `pnpm -F @bucketmate/nextjs publish --access public`
  - Or, cd into `packages/nextjs` and run `npm publish --access public`

## Notes
- This is designed for compatibility with Next.js App Router (v15) and aligns with Next.js v16 app router patterns where routes live under app/api. If you’re using a different routing strategy, adapt the handlers accordingly.
- For actual bucket operations, replace the simple payload with real adapter calls to your BucketMate core.

