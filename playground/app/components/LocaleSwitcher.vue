<script setup lang="ts">
const { locale, locales, setLocale } = useCmsLocale()

const localeLabels: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
}
</script>

<template>
  <div class="flex items-center gap-2">
    <button
      v-for="loc in locales"
      :key="loc"
      class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
      :class="[
        locale === loc
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      ]"
      @click="setLocale(loc)"
    >
      {{ localeLabels[loc] || loc.toUpperCase() }}
    </button>
  </div>
</template>
