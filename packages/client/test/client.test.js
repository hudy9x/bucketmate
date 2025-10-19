"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const vitest_1 = require("vitest");
(0, vitest_1.describe)('BucketMate Client (Mock provider)', () => {
    const config = {
        provider: 'mock',
        endpoint: 'https://mock',
        region: 'us-east-1',
        accessKeyId: 'akid',
        secretAccessKey: 'secret',
        bucket: 'test-bucket',
    };
    (0, vitest_1.test)('initializes and calls generatePresignedUrl', async () => {
        const client = (0, src_1.createBucketmateClient)(config);
        const url = await client.generatePresignedUrl({ key: 'path/file.txt' });
        (0, vitest_1.expect)(typeof url).toBe('string');
    });
});
