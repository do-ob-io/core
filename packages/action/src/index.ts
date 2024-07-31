export * as actions from '@do-ob/action/actions';

export async function schema($id: string = 'action.json') {
  const definitions = await import('@do-ob/action/schema');

  return {
    $id,
    $schema: 'http://json-schema.org/draft-07/schema',
    definitions: {
      ...definitions
    }
  };
}
