<script setup lang="ts">
const { author } = defineProps<{
  author: Record<string, unknown>
}>()

// Resolve avatar URL
const avatarUrl = useCmsAssetUrl(author.avatar as string | undefined)
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- Avatar -->
    <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
      <img
        v-if="avatarUrl"
        :src="avatarUrl"
        :alt="author.name as string || ''"
        class="w-full h-full object-cover"
      >
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-gray-400 text-sm"
      >
        {{ (author.name as string || '?').charAt(0).toUpperCase() }}
      </div>
    </div>

    <!-- Info -->
    <div>
      <div class="font-medium text-gray-900">
        {{ author.name }}
      </div>
      <div
        v-if="author.bio"
        class="text-sm text-gray-500 line-clamp-1"
      >
        {{ author.bio }}
      </div>
    </div>
  </div>
</template>
