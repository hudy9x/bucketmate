import { createBucketmateClient } from '@bucketmate/client'
import type { BucketClient, BucketClientConfig } from '@bucketmate/client'
import { NextRequest, NextResponse } from 'next/server'
import { BucketmateNextError } from './errors'
import { listObjectsAction, createPresignedUrlAction, deleteObjectAction } from './functions'

/**
 * Returns a Next.js route handler for a single provider instance.
 * Only 'r2' is supported in this single-provider version.
 */
interface Params {
  params: {
    slug: string[];
  }
}

type BucketmateRouteAction = {
  methods: ReadonlyArray<string>
  handler: (req: NextRequest, client: BucketClient) => Promise<unknown>
}

const ACTIONS: Record<string, BucketmateRouteAction> = {
  'list-objects': {
    methods: ['GET'],
    handler: listObjectsAction
  },
  'create-presigned-url': {
    methods: ['POST'],
    handler: createPresignedUrlAction
  },
  'delete-object': {
    methods: ['POST', 'DELETE'],
    handler: deleteObjectAction
  }
}

export function createBucketmateNextHandler(config: BucketClientConfig): (req: NextRequest, params: Params) => Promise<NextResponse> {
  const client: BucketClient = createBucketmateClient(config as any)

  async function handleRequest(req: NextRequest, params: Params) {
    const rawSlug = params?.params?.slug
    const slugSegments = typeof rawSlug === 'string' ? [rawSlug] : Array.isArray(rawSlug) ? rawSlug : []
    const actionKey = slugSegments[0]

    console.log("action key", actionKey)

    if (!actionKey) {
      throw new BucketmateNextError('Not Found', 404)
    }

    const action = ACTIONS[actionKey]

    if (!action) {
      throw new BucketmateNextError('Not Found', 404)
    }

    if (!action.methods.includes(req.method)) {
      throw new BucketmateNextError('Method Not Allowed', 405, { allow: action.methods.join(', ') })
    }

    return action.handler(req, client)
  }

  return async (req: NextRequest, params: Params) => {
    try {
      const result = await handleRequest(req, params)
      return NextResponse.json(result ?? {})
    } catch (error) {
      if (error instanceof BucketmateNextError) {
        const allowHeader =
          error.status === 405 && typeof error.details === 'object' && error.details !== null && 'allow' in error.details
            ? String((error.details as { allow?: string }).allow ?? '')
            : undefined

        return NextResponse.json(
          { error: error.message, ...(error.details ? { details: error.details } : {}) },
          {
            status: error.status,
            headers: allowHeader ? { Allow: allowHeader } : undefined
          }
        )
      }

      console.error('[BucketmateNextHandler] unexpected error', error)
      return NextResponse.json({ error: 'internal_error' }, { status: 500 })
    }
  }
}

export default { createBucketmateNextHandler }
