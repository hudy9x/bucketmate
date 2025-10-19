import { createBucketmateClient } from '../src';
import type { BucketClientConfig } from '../src/types';
import { describe, test, expect } from 'vitest';

describe('BucketMate Client (Mock provider)', () => {
  const config: BucketClientConfig = {
    provider: 'mock',
    endpoint: 'https://mock',
    region: 'us-east-1',
    accessKeyId: 'akid',
    secretAccessKey: 'secret',
    bucket: 'test-bucket',
  };

  test('initializes and calls generatePresignedUrl', async () => {
    type ClientType = ReturnType<typeof createBucketmateClient>;
    const client: ClientType = createBucketmateClient(config);
    const url = await client.generatePresignedUrl({ key: 'path/file.txt' });
    expect(typeof url).toBe('string');
  });
});
