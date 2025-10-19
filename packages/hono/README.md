# @bucketmate/hono

Exposes a Hono handler that mounts three routes for BucketMate operations using the local client:

- POST /create-presigned-url
- GET  /list-objects
- POST /delete-object

Usage:

```ts
import { createBucketmateHonoHandler } from '@bucketmate/hono';
import { Hono } from 'hono';
import { createBucketmateClient } from '@bucketmate/client';

const app = new Hono();

const handler = createBucketmateHonoHandler({
  provider: 's3',
  endpoint: 'https://s3.amazonaws.com',
  accessKeyId: '...',
  secretAccessKey: '...',
  region: 'us-east-1',
  bucket: 'your-bucket'
});

app.route('/api/files', handler);
```

