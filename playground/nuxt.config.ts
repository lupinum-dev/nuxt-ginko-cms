import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['ginko-nuxt'],
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-01-01',

  // Enable SSG for production
  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },

  vite: {
    plugins: [
      tailwindcss() as never,
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
})
