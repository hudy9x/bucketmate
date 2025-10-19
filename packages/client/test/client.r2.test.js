"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const src_1 = require("../src");
const vitest_1 = require("vitest");
const R2_BUCKET_NAME = (_a = process.env.R2_BUCKET_NAME) !== null && _a !== void 0 ? _a : '';
const R2_ENDPOINT = (_b = process.env.R2_ENDPOINT) !== null && _b !== void 0 ? _b : '';
const R2_ACCESS_KEY = (_c = process.env.R2_ACCESS_KEY) !== null && _c !== void 0 ? _c : '';
const R2_SECRET_KEY = (_d = process.env.R2_SECRET_KEY) !== null && _d !== void 0 ? _d : '';
const R2_REGION = (_e = process.env.R2_REGION) !== null && _e !== void 0 ? _e : 'auto';
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
(0, vitest_1.describe)('BucketMate Client Cloudflare R2 (real credentials)', () => {
    const hasKeys = R2_BUCKET_NAME && R2_ENDPOINT && R2_ACCESS_KEY && R2_SECRET_KEY;
    const runTest = hasKeys ? vitest_1.test : vitest_1.test.skip;
    const assets = ['test-1.png', 'test-2.png'];
    runTest('generate presigned URLs for assets in R2', async () => {
        const config = {
            provider: 'r2',
            endpoint: R2_ENDPOINT,
            region: R2_REGION,
            accessKeyId: R2_ACCESS_KEY,
            secretAccessKey: R2_SECRET_KEY,
            bucket: R2_BUCKET_NAME,
        };
        const client = (0, src_1.createBucketmateClient)(config);
        for (const filename of assets) {
            const url = await client.generatePresignedUrl({ key: `assets/${filename}` });
            console.log(url);
            (0, vitest_1.expect)(typeof url).toBe('string');
        }
    });
    runTest('upload via presigned URL using axios', async () => {
        const config = {
            provider: 'r2',
            endpoint: R2_ENDPOINT,
            region: R2_REGION,
            accessKeyId: R2_ACCESS_KEY,
            secretAccessKey: R2_SECRET_KEY,
            bucket: R2_BUCKET_NAME,
        };
        const client = (0, src_1.createBucketmateClient)(config);
        const key = `uploads/${Date.now()}-upload.png`;
        const presignedUrl = await client.generatePresignedUrl({ key });
        const filePath = path_1.default.resolve(__dirname, '../assets/test-1.png');
        const data = fs_1.default.readFileSync(filePath);
        const res = await axios_1.default.put(presignedUrl, data, {
            headers: { 'Content-Type': 'image/png' },
        });
        (0, vitest_1.expect)(res.status).toBeLessThan(300);
        const keys = await client.listObjects({ prefix: 'uploads/' });
        (0, vitest_1.expect)(keys).toContain(key);
        await client.deleteObject({ key });
        const keysAfter = await client.listObjects({ prefix: 'uploads/' });
        (0, vitest_1.expect)(keysAfter).not.toContain(key);
    });
});
