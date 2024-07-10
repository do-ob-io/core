import { createGenerator, type Config } from 'ts-json-schema-generator';
import { glob } from 'glob';
import fs from 'fs';
// import Ajv, { Schema } from 'ajv';
// import formats from 'ajv-formats';
// import standalone from 'ajv/dist/standalone';

const typeFiles = glob.sync('./src/action/*.types.ts');
const outputDir = './src/_schema';

// const schemas: Array<Schema> = [];
const schemaNames: Array<string> = [];

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Delete all files in outputDir
// fs.readdirSync(outputDir).forEach((file) => {
//   const filePath = `${outputDir}/${file}`;
//   fs.unlinkSync(filePath);
// });

// const schemas: Array<string> = [];

typeFiles.forEach((file) => {

  const fileName = file.split('/').pop()?.replace('.types.ts', '');

  if (!fileName) {
    return;
  }

  const config: Config = {
    path: file,
    schemaId: `${fileName}`,
    topRef: false,
    minify: true,
    type: '*',
  };

  const generator = createGenerator(config);
  const schema = generator.createSchema(config.type);

  const code = `export default ${JSON.stringify(schema, null, 2)}`;
  const filePath = `src/_schema/${fileName}.ts`;

  fs.writeFileSync(filePath, code);

  // schemas.push(schema);
  schemaNames.push(fileName);
  
});

/**
 * Write the entry point schema module.
 */
const code = 
`${schemaNames.map((s) => (`import { default as ${s} } from './_schema/${s}';`)).join('\n')}

export {
  ${schemaNames.join(',\n')}
};
`;

const filePath = 'src/schema.ts';
const directoryPath = filePath.split('/').slice(0, -1).join('/');
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
}
fs.writeFileSync(filePath, code);

/**
 * Write the standalone validator code.
 */
// const ajv = new Ajv({
//   schemas,
//   code: {
//     source: true,
//     esm: true,
//   },
// });

// formats(ajv, [ 'uuid', 'hostname', 'email', 'password', 'ipv4', 'ipv6', 'binary', 'byte' ]);
// ajv.addFormat('handle', /^[a-zA-Z][a-zA-Z0-9_]{0,19}$/);

// const validatorCode = standalone(ajv);

// fs.writeFileSync('src/validate.js', validatorCode);
// fs.writeFileSync('dist/validate.js', validatorCode);
