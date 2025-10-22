import { S3Adapter } from './adapters/s3';
import { DoAdapter } from './adapters/do';
import { R2Adapter } from './adapters/r2';
import { MinioAdapter } from './adapters/minio';
import { MockAdapter } from './adapters/mock';
import { BucketClientConfig, AdapterInterface, Provider } from './types';

function isNotPlainObject(value: unknown) {
  return !(
    typeof value === 'object' &&
    value !== null &&
    value.constructor === Object
  );
}

export function createBucketmateClient(config: BucketClientConfig) {
  if (!config || Object.keys(config).length === 0) {
    throw new Error("Bucketmate: missing configuration")
  }

  if (isNotPlainObject(config)) {
    throw new Error("Bucketmate: configuration must be an object")
  }

  let adapter: AdapterInterface;
  switch (config.provider) {
    case 's3':
      config.endpoint = '';
      adapter = new S3Adapter(config);
      break;
    case 'do':
      adapter = new DoAdapter(config);
      break;
    case 'r2':
      adapter = new R2Adapter(config);
      break;
    case 'minio':
      adapter = new MinioAdapter(config);
      break;
    case 'mock':
      adapter = new MockAdapter(config);
      break;
    default:
      throw new Error('Unsupported provider');
  }
  return {
    generatePresignedUrl: (p: { key: string }) => adapter.generatePresignedUrl(p),
    deleteObject: (p: { key: string }) => adapter.deleteObject(p),
    listObjects: (p?: { prefix?: string }) => adapter.listObjects(p as any),
    getObjectUrl: (p: { key: string }) => adapter.getObjectUrl(p),
  };
}

export function createS3Client(config?: any) {
  const cfg = config ?? {
    provider: 's3' as const,
    endpoint: process.env.BUCKETMATE_S3_ENDPOINT ?? 'https://s3.amazonaws.com',
    region: process.env.BUCKETMATE_S3_REGION ?? 'us-east-1',
    accessKeyId: process.env.BUCKETMATE_S3_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.BUCKETMATE_S3_SECRET_ACCESS_KEY ?? '',
    bucket: process.env.BUCKETMATE_S3_BUCKET ?? 'bucket'
  };
  return createBucketmateClient(cfg as any);
}

export type BucketClient = ReturnType<typeof createBucketmateClient>;
