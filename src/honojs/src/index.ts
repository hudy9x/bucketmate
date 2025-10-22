import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: resolve(__dirname, '../.env') })

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { createBucketmateHonoHandler } from '@bucketmate/hono'

const app = new Hono()

// R2 configuration (existing)
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME ?? '';
const R2_ENDPOINT = process.env.R2_ENDPOINT ?? '';
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY ?? '';
const R2_SECRET_KEY = process.env.R2_SECRET_KEY ?? '';
const R2_REGION = process.env.R2_REGION ?? 'auto';

// AWS S3 configuration (new)
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID ?? ''
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY ?? ''
const AWS_S3_ENDPOINT = process.env.AWS_S3_ENDPOINT ?? ''
const AWS_REGION = process.env.AWS_REGION ?? 'us-east-1'
const AWS_BUCKET = process.env.AWS_BUCKET ?? 'heiilo'


// Minio configuration (new)
const MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY
const MINIO_REGION = process.env.MINIO_REGION ?? "auto"

// Digital Ocean configuration (new)
const DO_BUCKET_NAME = process.env.DO_BUCKET_NAME
const DO_ENDPOINT = process.env.DO_ENDPOINT
const DO_REGION = process.env.DO_REGION
const DO_ACCESS_KEY = process.env.DO_ACCESS_KEY
const DO_SECRET_KEY = process.env.DO_SECRET_KEY


console.log('bucketmate config', {
  provider: 'r2',
  endpoint: R2_ENDPOINT,
  region: R2_REGION,
  accessKeyId: R2_ACCESS_KEY,
  secretAccessKey: R2_SECRET_KEY,
  bucket: R2_BUCKET_NAME,
})

console.log('bucketmate minio config', {
  provider: 'minio',
  endpoint: MINIO_ENDPOINT,
  region: MINIO_REGION,
  accessKeyId: MINIO_ACCESS_KEY,
  secretAccessKey: MINIO_SECRET_KEY,
  bucket: MINIO_BUCKET_NAME,
})


console.log('bucketmate do config', {
  provider: 'do',
  endpoint: DO_ENDPOINT,
  region: DO_REGION,
  accessKeyId: DO_ACCESS_KEY,
  secretAccessKey: DO_SECRET_KEY,
  bucket: DO_BUCKET_NAME,
})

console.log('bucketmate config', {
  provider: 's3',
  endpoint: AWS_S3_ENDPOINT,
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  bucket: AWS_BUCKET,
})

// Mount BucketMate routes under /api/bucketmate
const bucketmateRouter = createBucketmateHonoHandler({
  provider: 'r2',
  endpoint: R2_ENDPOINT,
  region: R2_REGION,
  accessKeyId: R2_ACCESS_KEY,
  secretAccessKey: R2_SECRET_KEY,
  bucket: R2_BUCKET_NAME,
})

const bucketmateMinioRouter = createBucketmateHonoHandler({
  provider: 'minio',
  endpoint: MINIO_ENDPOINT,
  region: MINIO_REGION,
  accessKeyId: MINIO_ACCESS_KEY,
  secretAccessKey: MINIO_SECRET_KEY,
  bucket: MINIO_BUCKET_NAME,
})

const bucketmateDoRouter = createBucketmateHonoHandler({
  provider: 'do',
  endpoint: DO_ENDPOINT,
  region: DO_REGION,
  accessKeyId: DO_ACCESS_KEY,
  secretAccessKey: DO_SECRET_KEY,
  bucket: DO_BUCKET_NAME,
})

const bucketmateS3Router = createBucketmateHonoHandler({
  provider: 's3',
  endpoint: AWS_S3_ENDPOINT,
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  bucket: AWS_BUCKET,
})

app.use(async (c, next) => {
  console.log(c.req.method, c.req.path);
  await next()
})

app.use('/api/*', cors())

app.route('/api/bucketmate', bucketmateRouter)
app.route('/api/bucketmate-s3', bucketmateS3Router)
app.route('/api/bucketmate-minio', bucketmateMinioRouter)
app.route('/api/bucketmate-do', bucketmateDoRouter)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: 4001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
