<template>
  <div class="min-h-screen">
    <header class="border-b border-[var(--ginko-line)] bg-[var(--ginko-panel)] backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div class="flex items-center gap-6">
          <NuxtLink
            to="/"
            class="text-xl font-semibold tracking-[0.18em] uppercase"
          >
            Ginko Nuxt
          </NuxtLink>

          <nav class="flex items-center gap-4 text-sm text-[var(--ginko-muted)]">
            <NuxtLink
              to="/blog"
              class="rounded-full px-3 py-1.5 transition hover:bg-white/70 hover:text-[var(--ginko-ink)]"
            >
              Blog
            </NuxtLink>
            <NuxtLink
              to="/docs"
              class="rounded-full px-3 py-1.5 transition hover:bg-white/70 hover:text-[var(--ginko-ink)]"
            >
              Docs
            </NuxtLink>
          </nav>
        </div>

        <p class="text-xs tracking-[0.24em] uppercase text-[var(--ginko-muted)]">
          Current API playground
        </p>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-6 py-10">
      <slot />
    </main>

    <footer class="border-t border-[var(--ginko-line)] bg-[var(--ginko-panel)]">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-sm text-[var(--ginko-muted)]">
        <p>
          Powered by Ginko CMS
        </p>
        <p>
          `ginkoCms.site` + `useGinko*`
        </p>
      </div>
    </footer>
  </div>
</template>
