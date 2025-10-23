import type { BucketClient } from '@bucketmate/client'
import { BucketmateNextError } from '../errors'

export async function deleteObjectAction(req: Request, client: BucketClient) {
  let body: unknown = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }
  const key = (body as { key?: unknown }).key
  if (typeof key !== 'string' || key.length === 0) {
    throw new BucketmateNextError('key is required', 400)
  }
  await client.deleteObject({ key })
  return { ok: true }
}
