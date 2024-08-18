import fs from 'node:fs';
import path from 'node:path';

const scriptsPath = path.resolve(import.meta.url, './scripts');

// Copy the *.sql file from _migration_core to scripts core.sql. Overwrite if it exists. Ensure that paths are relative to where this script exists.
const coreMigrationPath = path.resolve(import.meta.url, './_migration_core');
const coreSql = path.resolve(scriptsPath, './core.sql');
if (fs.existsSync(coreMigrationPath) && fs.existsSync(scriptsPath)) {
  fs.copyFileSync(coreMigrationPath, coreSql);
  // Remove the _migration_core directory.
  fs.rmdirSync(coreMigrationPath, { recursive: true });
}

// Copy the *.sql file from _migration_web to scripts web.sql. Overwrite if it exists. Ensure that paths are relative to where this script exists.
const webMigrationPath = path.resolve(import.meta.url, './_migration_web');
const webSql = path.resolve(scriptsPath, './web.sql');
if (fs.existsSync(webMigrationPath) && fs.existsSync(scriptsPath)) {
  fs.copyFileSync(webMigrationPath, webSql);
  // Remove the _migration_web directory.
  fs.rmdirSync(webMigrationPath, { recursive: true });
}
