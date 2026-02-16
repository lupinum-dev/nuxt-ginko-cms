import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: ['../cms-nuxt/src/module'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  cmsNuxt: {
    // API connection - uses env vars automatically via module defaults
    // Set in .env.local: NUXT_CMS_API_URL, NUXT_CMS_TEAM_SLUG
    // API keys: NUXT_CMS_API_KEY_PUBLIC, NUXT_CMS_API_KEY_PREVIEW

    locales: ['en', 'de'],
    defaultLocale: 'en',

    collections: [
      {
        slug: 'blogs',
        populate: ['author'],
        routePattern: '/blog/[slug]',
      },
      {
        slug: 'authors',
      },
      {
        slug: 'legal',
        routePattern: '/legal/[slug]',
      },
    ],

    // Preview mode is auto-detected:
    // - dev server: preview mode (real-time API)
    // - production build: static mode (cached content)
    assetDir: 'cms-assets',
    cacheDir: '.cms-cache',
  },

  // Enable SSG for production
  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },
})
