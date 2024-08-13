import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * The most generic type of item.
 */
export const table = pgTable('thing', {
  /**
   * Unique identifier for each `Thing` instance.
   * This serves as the primary key for the table.
   */
  $id: serial('id').primaryKey(),

  /**
   * The name of the item.
   * This is a required field and must be a non-null string.
   */
  name: varchar('name', { length: 255 }).notNull(),

  /**
   * A textual description of the item.
   * This provides additional information about the `Thing`.
   */
  description: text('description'),

  /**
   * A URL to the item.
   * This should be a valid URL that points to a webpage about the `Thing`.
   */
  url: varchar('url', { length: 2083 }),

  /**
   * A URL that unambiguously indicates the item's identity.
   * Often used for linking to an authoritative source like Wikipedia or Wikidata.
   */
  sameAs: varchar('same_as', { length: 2083 }),

  /**
   * A unique identifier for the item.
   * This can be a string or URL that identifies the `Thing` in some other system.
   */
  identifier: varchar('identifier', { length: 255 }),

  /**
   * A URL to an image representing the item.
   * This URL should point to a visual representation of the `Thing`.
   */
  image: varchar('image', { length: 2083 }),

  /**
   * An additional type for the item.
   * Typically used for specifying more specific types from other vocabularies.
   */
  additionalType: varchar('additional_type', { length: 2083 }),

  /**
   * An alternate name for the item.
   * This is an alternative way to refer to the `Thing`.
   */
  alternateName: varchar('alternate_name', { length: 255 }),

  /**
   * A short description of the item used to disambiguate it from similar items.
   * This helps to differentiate this `Thing` from others with similar names.
   */
  disambiguatingDescription: text('disambiguating_description'),

  /**
   * A URL to the main page for the entity.
   * This is often used to point to the primary webpage that describes the `Thing`.
   */
  mainEntityOfPage: varchar('main_entity_of_page', { length: 2083 }),

  /**
   * The date the item was created.
   * Defaults to the current timestamp when the record is first created.
   */
  dateCreated: timestamp('date_created').defaultNow(),

  /**
   * The date the item was last modified.
   * Defaults to the current timestamp, automatically updating when the record is changed.
   */
  dateModified: timestamp('date_modified').defaultNow().$onUpdateFn(() => new Date()),
});
