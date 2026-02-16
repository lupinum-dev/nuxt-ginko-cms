export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },

  cmsNuxt: {
    apiUrl: 'https://example.convex.site',
    apiKey: 'test-key',
    teamSlug: 'test-team',
    locales: ['en'],
    defaultLocale: 'en',
    collections: [],
  },
})
