import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  cmsNuxt: {
    apiUrl: 'https://example.convex.site',
    teamSlug: 'example-team',
    apiKeyPublic: 'example-public-key',
    locales: ['en'],
    defaultLocale: 'en',
    collections: [],
    preview: true,
  },
})
