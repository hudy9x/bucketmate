import { AdapterInterface, BucketClientConfig } from '../types';

export class MockAdapter implements AdapterInterface {
  private bucket: string;
  private store: Record<string, string> = {};

  constructor(config: BucketClientConfig) {
    this.bucket = config.bucket;
  }

  async generatePresignedUrl({ key }: { key: string }): Promise<string> {
    return `https://mock/${this.bucket}/${key}?signature=mock`;
  }

  async deleteObject({ key }: { key: string }): Promise<void> {
    delete this.store[`${this.bucket}/${key}`];
  }

  async listObjects({ prefix }: { prefix?: string } = {}): Promise<string[]> {
    const prefixKey = prefix ?? '';
    return Object.keys(this.store)
      .filter((k) => k.startsWith(`${this.bucket}/${prefixKey}`))
      .map((k) => k.split('/').slice(2).join('/'));
  }

  getObjectUrl({ key }: { key: string }): string {
    return `https://mock/${this.bucket}/${key}`;
  }
}
