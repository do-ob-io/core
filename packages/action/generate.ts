import { createGenerator, type Config } from 'ts-json-schema-generator';
import { glob } from 'glob';
import fs from 'fs';

const typeFiles = glob.sync('./src/action/*.types.ts');

const schemas: Array<string> = [];

typeFiles.forEach((file) => {

  const fileName = file.split('/').pop()?.replace('.types.ts', '');

  if (!fileName) {
    return;
  }

  const config: Config = {
    path: file,
    schemaId: `action/${fileName}`,
    topRef: false,
    minify: false,
    type: '*',
  };

  const generator = createGenerator(config);
  const schema = generator.createSchema(config.type);

  delete schema.$schema;

  const code = `export default ${JSON.stringify(schema, null, 2)}`;
  const filePath = `src/_schema/${fileName}.ts`;
  const directoryPath = filePath.split('/').slice(0, -1).join('/');

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  fs.writeFileSync(filePath, code);

  schemas.push(`export { default as ${fileName} } from './${fileName}';`);
  
});

const code = `${schemas.join('\n')}`;

const filePath = 'src/_schema/index.ts';
const directoryPath = filePath.split('/').slice(0, -1).join('/');
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
}
fs.writeFileSync(filePath, code);
