import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AdapterInterface, BucketClientConfig } from '../types';

export class MinioAdapter implements AdapterInterface {
  private client: S3Client;
  private config: BucketClientConfig;

  constructor(config: BucketClientConfig) {
    this.config = config;
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      endpoint: config.endpoint,
      forcePathStyle: true,
    });
  }

  async generatePresignedUrl({ key }: { key: string }): Promise<string> {
    const command = new PutObjectCommand({ Bucket: this.config.bucket, Key: key });
    return getSignedUrl(this.client, command, { expiresIn: 3600 });
  }

  async deleteObject({ key }: { key: string }): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.config.bucket, Key: key }));
  }

  async listObjects({ prefix }: { prefix?: string } = {}): Promise<string[]> {
    const resp = await this.client.send(new ListObjectsV2Command({ Bucket: this.config.bucket, Prefix: prefix }));
    const keys = (resp.Contents ?? []).map((c) => c.Key).filter((k): k is string => !!k);
    return keys;
  }

  getObjectUrl({ key }: { key: string }): string {
    return `${this.config.endpoint}/${this.config.bucket}/${key}`;
  }
}
