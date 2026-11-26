import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './out/openapi.mobile.json',
  output: './src/api/generated',
  plugins: [
    '@hey-api/typescript',
    { name: '@hey-api/sdk', responseStyle: 'data' },
    '@hey-api/client-fetch',
    { name: '@tanstack/react-query', mutationOptions: true, infiniteQueryOptions: false },
  ],
});
