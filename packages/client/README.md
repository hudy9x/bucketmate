# BucketMate Client

A minimal, extensible S3-compatible client macro with a factory + strategy adapters.

## Usage

Example (Node/Express/Hono/Next.js in a few lines):

```ts
import { createBucketmateClient } from '@bucketmate/client';

const client = createBucketmateClient({
  provider: 's3',
  endpoint: 'https://s3.amazonaws.com',
  region: 'us-east-1',
  accessKeyId: '...',
  secretAccessKey: '...',
  bucket: 'my-bucket'
});
```

## Methods
- `generatePresignedUrl({ key })` for PUT uploads
- `deleteObject({ key })`
- `listObjects({ prefix? })`
- `getObjectUrl({ key })`
