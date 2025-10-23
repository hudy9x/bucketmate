import type { BucketClient } from '@bucketmate/client'

export async function listObjectsAction(req: Request, client: BucketClient) {
  const urlStr = (req as unknown as { url?: string }).url ?? ''
  const url = new URL(urlStr)
  const prefix = url.searchParams.get('prefix') ?? undefined
  const keys = await client.listObjects({ prefix })
  return { keys }
}
