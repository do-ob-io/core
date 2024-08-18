import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/schema/web.ts',
  out: './_migration_web',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_CONNECTION || 'memory://./pglite',
  },
} satisfies Config;
