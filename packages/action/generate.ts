import { createGenerator, Schema, type Config } from 'ts-json-schema-generator';
import { glob } from 'glob';
import { titleCase } from '@do-ob/core';
import fs from 'fs';
// import Ajv, { Schema } from 'ajv';
// import formats from 'ajv-formats';
// import standalone from 'ajv/dist/standalone';

const typeFiles = glob.sync('./src/action/*.ts');
const outputDir = './src/_schema';

// const schemas: Array<Schema> = [];
const schemaNames: Array<string> = [];
const dictionary: Record<string, string> = {};

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

  const actionName = file.split('/').pop()?.replace('.ts', '');

  if (!actionName) {
    return;
  }

  const config: Config = {
    path: file,
    schemaId: `${actionName}`,
    topRef: false,
    minify: true,
    type: 'Payload',
    skipTypeCheck: true,
  };

  const generator = createGenerator(config);
  const schema = generator.createSchema(config.type);

  if(schema.title) {
    const titleKey = `action.${actionName}.title`;
    const title = schema.title;
    schema.title = '%' + titleKey;
    dictionary[titleKey] = titleCase(title);
  } else {
    const titleKey = `action.${actionName}.title`;
    const title = actionName.replace(/([A-Z])/g, ' $1').trim();
    schema.title = '%' + titleKey;
    dictionary[titleKey] = titleCase(title);
  }

  if(schema.description) {
    const descriptionKey = `action.${actionName}.description`;
    const description = schema.description;
    schema.description = '%' + descriptionKey;
    dictionary[descriptionKey] = description;
  }

  const { properties } = schema;
  if(properties) {
    Object.keys(properties).forEach((key) => {
      const property = properties[key] as Schema;
      const titleKey = `action.${actionName}.${key}.title`;
      if(property.title) {
        const title = property.title;
        property.title = '%' + titleKey;
        dictionary[titleKey] = title;
      } else {
        const title = key.replace(/([A-Z])/g, ' $1').trim();
        property.title = '%' + titleKey;
        dictionary[titleKey] = title;
      }
      if(property.description) {
        const descriptionKey = `action.${actionName}.${key}.description`;
        const description = property.description;
        property.description = '%' + descriptionKey;
        dictionary[descriptionKey] = description;
      }
    });
  }

  const code = `export default ${JSON.stringify(schema, null, 2)}`;
  const filePath = `src/_schema/${actionName}.ts`;

  fs.writeFileSync(filePath, code);

  // schemas.push(schema);
  schemaNames.push(actionName);
  
});

/**
 * Write the entry point schema module.
 */
const code = 
`${schemaNames.map((s) => (`import { default as ${s} } from './_schema/${s}';`)).join('\n')}

export {
  ${schemaNames.join(',\n  ')}
};
`;

const filePath = 'src/schema.ts';
const directoryPath = filePath.split('/').slice(0, -1).join('/');
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
}
fs.writeFileSync(filePath, code);

/**
 * Write the dictionary file.
 */
const dictionaryCode = `export default ${JSON.stringify(dictionary, null, 2)}`;
const dictionaryFilePath = 'src/dictionary.ts';
fs.writeFileSync(dictionaryFilePath, dictionaryCode);

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
