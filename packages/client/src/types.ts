export type Provider = 's3' | 'do' | 'r2' | 'minio' | 'mock';

export interface BucketClientConfig {
  provider: Provider;
  endpoint: string;
  region?: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

export interface AdapterInterface {
  generatePresignedUrl(params: { key: string }): Promise<string>;
  deleteObject(params: { key: string }): Promise<void>;
  listObjects(params?: { prefix?: string }): Promise<string[]>;
  getObjectUrl(params: { key: string }): string;
}
