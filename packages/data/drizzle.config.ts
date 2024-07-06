import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/schema.ts',
  out: './_migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_CONNECTION || 'file://./pglite',
  },
} satisfies Config;
