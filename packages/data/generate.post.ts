import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve the directory name where the script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the target directory for copied scripts
const targetDir = path.join(__dirname, 'scripts');

// Ensure the target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Get all directories in the current script's directory
const directories = fs.readdirSync(__dirname, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// Process each directory that matches the pattern "_migration_<name>"
directories.forEach(directory => {
  const match = directory.match(/^_migration_(.+)$/);
  if (match) {
    const name = match[1];
    const migrationDir = path.join(__dirname, directory);
        
    // Get the first *.sql file in the directory
    const sqlFiles = fs.readdirSync(migrationDir).filter(file => file.endsWith('.sql'));

    if (sqlFiles.length > 0) {
      const sourceFile = path.join(migrationDir, sqlFiles[0]);
      const destFile = path.join(targetDir, `${name}.sql`);

      // Copy the file to the target directory
      fs.copyFileSync(sourceFile, destFile);

      console.log(`Copied ${sourceFile} to ${destFile}`);

      // Remove the _migration_<name> directory
      fs.rmSync(migrationDir, { recursive: true, force: true });

      console.log(`Removed directory: ${migrationDir}`);
    }
  }
});

console.log('Script completed.');
