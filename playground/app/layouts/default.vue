<script setup lang="ts">
useCmsLocale()
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="text-xl font-bold text-gray-900">
            CMS Demo
          </NuxtLink>

          <nav class="flex items-center gap-6">
            <NuxtLink to="/blog" class="text-gray-600 hover:text-gray-900">
              Blog
            </NuxtLink>
            <NuxtLink to="/legal/privacy-policy" class="text-gray-600 hover:text-gray-900">
              Privacy
            </NuxtLink>

            <!-- Locale Switcher -->
            <LocaleSwitcher />
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p class="text-center text-gray-500 text-sm">
          Demo CMS Consumer - Powered by Convex CMS
        </p>
      </div>
    </footer>
  </div>
</template>
