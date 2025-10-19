import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from both root and package-level .env files if present
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export default defineConfig({
  test: {
    globals: true,
  },
});
