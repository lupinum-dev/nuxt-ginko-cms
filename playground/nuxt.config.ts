import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@lupinum/ginko-nuxt'],
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

  ginkoCms: {
    site: {
      defaultLocale: 'en',
      locales: [{ code: 'en', hreflang: 'en-US', isDefault: true }],
      routing: {
        localePrefixStrategy: 'none',
      },
      staticRoutes: ['/', '/blog', '/docs'],
      collections: {
        blog: {
          kind: 'flat',
          source: 'blog-posts',
          routing: {
            prefix: '/blog',
          },
        },
        docs: {
          kind: 'hierarchy',
          source: 'docs',
          routing: {
            baseSegment: 'docs',
            rootSlug: 'quick-start',
          },
          includeFolders: true,
          maxDepth: 3,
        },
      },
      search: {
        enabled: true,
        defaultLimit: 8,
      },
    },
  },
})
