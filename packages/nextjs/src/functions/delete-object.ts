import { NextRequest } from 'next/server'
import type { BucketClient } from '@bucketmate/client'
import { BucketmateNextError } from '../errors'

export async function deleteObjectAction(req: NextRequest, client: BucketClient) {
  const body = await (req as any).json().catch(() => ({}))
  const key = (body as any)?.key
  if (typeof key !== 'string' || key.length === 0) {
    throw new BucketmateNextError('key is required', 400)
  }
  await client.deleteObject({ key } as any)
  return { ok: true }
}
