import { Hono } from 'hono';
import { createBucketmateClient } from '@bucketmate/client';
import type { BucketClient } from '@bucketmate/client';

// Creates a sub-router for Hono that exposes three routes:
// - POST /create-presigned-url
// - GET  /list-objects
// - POST /delete-object
export function createBucketmateHonoHandler(config: any) {
  const client: BucketClient = createBucketmateClient(config);
  const router = new Hono();

  // Create presigned URL for uploading a key
  router.post('/create-presigned-url', async (c) => {
    try {
      const body = await c.req.json().catch(() => ({}));
      const key = (body as any)?.key;
      if (typeof key !== 'string' || key.length === 0) {
        return c.json({ error: 'key is required' }, 400);
      }
      const url = await client.generatePresignedUrl({ key });
      return c.json({ url });
    } catch (e) {
      return c.json({ error: 'internal_error' }, 500);
    }
  });

  // List objects, optionally filtered by prefix
  router.get('/list-objects', async (c) => {
    try {
      let prefix: string | undefined;
      try {
        const url = new URL((c.req as any).url);
        prefix = url.searchParams.get('prefix') ?? undefined;
      } catch {
        prefix = undefined;
      }
      const keys = await client.listObjects({ prefix } as any);
      return c.json({ keys });
    } catch (e) {
      return c.json({ error: 'internal_error' }, 500);
    }
  });

  // Delete an object by key
  router.post('/delete-object', async (c) => {
    try {
      const body = await c.req.json().catch(() => ({}));
      const key = (body as any)?.key;
      if (typeof key !== 'string' || key.length === 0) {
        return c.json({ error: 'key is required' }, 400);
      }
      await client.deleteObject({ key });
      return c.json({ ok: true });
    } catch (e) {
      return c.json({ error: 'internal_error' }, 500);
    }
  });

  // Return the configured sub-router to be mounted by app.route('/api/files', handler)
  return router;
}

export default createBucketmateHonoHandler;
