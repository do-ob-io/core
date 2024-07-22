/// <reference types="vitest" />
import { mergeConfig, defineConfig } from 'vite';
import { viteLibConfig } from '@do-ob/vite-lib-config';

export default mergeConfig(
  viteLibConfig(),
  defineConfig({
    test: {
      typecheck: {
        enabled: true,
      },
      include: [ '**/*.{test,spec}.?(c|m)[jt]s?(x)' ]
    },
  })
);
