import { customType } from 'drizzle-orm/pg-core';

/**
 * A custom type for storing binary data.
 */
export const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return 'bytea';
  },
});
