import { NextRequest } from 'next/server'
import type { BucketClient } from '@bucketmate/client'

export async function listObjectsAction(req: NextRequest, client: BucketClient) {
  const url = new URL((req as any).url)
  const prefix = url.searchParams.get('prefix') ?? undefined
  const keys = await client.listObjects({ prefix } as any)
  return { keys }
}
