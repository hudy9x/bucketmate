import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { createBucketmateClient } from '../src';
import type { BucketClientConfig } from '../src/types';
import { describe, test, expect } from 'vitest';

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID ?? '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY ?? '';
const AWS_S3_ENDPOINT = process.env.AWS_S3_ENDPOINT ?? 'https://s3.amazonaws.com';
const AWS_REGION = process.env.AWS_REGION ?? 'us-east-1';
const AWS_BUCKET = process.env.AWS_BUCKET ?? 'bucketmate-test';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

describe('BucketMate Client AWS S3 (real credentials)', () => {
  const hasKeys = AWS_ACCESS_KEY_ID !== '' && AWS_SECRET_ACCESS_KEY !== '';
  console.log('hasKey', hasKeys);
  const runTest = hasKeys ? test : test.skip;

  const assets = ['test-1.png', 'test-2.png'];

  runTest('generate presigned URLs for assets in S3', async () => {
    const config: BucketClientConfig = {
      provider: 's3',
      endpoint: AWS_S3_ENDPOINT,
      region: AWS_REGION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      bucket: AWS_BUCKET,
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
      provider: 's3',
      endpoint: AWS_S3_ENDPOINT,
      region: AWS_REGION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      bucket: AWS_BUCKET,
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
