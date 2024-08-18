import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/schema/core.ts',
  out: './_migration_core',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_CONNECTION || 'memory://./pglite',
  },
} satisfies Config;
