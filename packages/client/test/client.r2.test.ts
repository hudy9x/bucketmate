import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { createBucketmateClient } from '../src';
import type { BucketClientConfig } from '../src/types';
import { describe, test, expect } from 'vitest';

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME ?? '';
const R2_ENDPOINT = process.env.R2_ENDPOINT ?? '';
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY ?? '';
const R2_SECRET_KEY = process.env.R2_SECRET_KEY ?? '';
const R2_REGION = process.env.R2_REGION ?? 'auto';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

describe('BucketMate Client Cloudflare R2 (real credentials)', () => {
  const hasKeys = R2_BUCKET_NAME && R2_ENDPOINT && R2_ACCESS_KEY && R2_SECRET_KEY;
  const runTest = hasKeys ? test : test.skip;

  const assets = ['test-1.png','test-2.png'];

  runTest('generate presigned URLs for assets in R2', async () => {
    const config: BucketClientConfig = {
      provider: 'r2',
      endpoint: R2_ENDPOINT,
      region: R2_REGION,
      accessKeyId: R2_ACCESS_KEY,
      secretAccessKey: R2_SECRET_KEY,
      bucket: R2_BUCKET_NAME,
    };
    const client = createBucketmateClient(config);
    for (const filename of assets) {
      const url = await client.generatePresignedUrl({ key: `assets/${filename}` });
      console.log(url)
      expect(typeof url).toBe('string');
    }
  });

  runTest('upload via presigned URL using axios', async () => {
    const config: BucketClientConfig = {
      provider: 'r2',
      endpoint: R2_ENDPOINT,
      region: R2_REGION,
      accessKeyId: R2_ACCESS_KEY,
      secretAccessKey: R2_SECRET_KEY,
      bucket: R2_BUCKET_NAME,
    };
    const client = createBucketmateClient(config);
    const key = `uploads/${Date.now()}-upload.png`;
    const presignedUrl = await client.generatePresignedUrl({ key });
    const filePath = path.resolve(__dirname, '../assets/test-1.png');
    const data = fs.readFileSync(filePath);
    const res = await axios.put(presignedUrl, data, {
      headers: { 'Content-Type': 'image/png' },
    });
    expect(res.status).toBeLessThan(300);

    const keys = await client.listObjects({ prefix: 'uploads/' });
    expect(keys).toContain(key);

    await client.deleteObject({ key });
    const keysAfter = await client.listObjects({ prefix: 'uploads/' });
    expect(keysAfter).not.toContain(key);
  });
});
