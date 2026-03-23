<script setup>
import { useRuntimeConfig } from "#imports";
import { parseMarkdown } from "@nuxtjs/mdc/runtime";
import { computed, ref, watch } from "vue";
import { cmsMdcNormalize } from "../utils/cmsMdcNormalize";
import { mergeMdcComponentMap } from "../utils/mdcComponentMap";
const props = defineProps({
  value: { type: [String, null], required: false, default: null },
  class: { type: String, required: false, default: "" },
  prose: { type: Boolean, required: false, default: true },
  components: { type: Object, required: false, default: void 0 }
});
const markdown = computed(() => cmsMdcNormalize(props.value || ""));
const runtimeConfig = useRuntimeConfig();
const ast = ref(null);
const parseError = ref(null);
async function parseCurrentMarkdown() {
  parseError.value = null;
  if (!markdown.value) {
    ast.value = null;
    return;
  }
  try {
    ast.value = await parseMarkdown(markdown.value);
  } catch (error) {
    ast.value = null;
    parseError.value = error;
  }
}
await parseCurrentMarkdown();
watch(markdown, () => {
  void parseCurrentMarkdown();
});
const hasError = computed(() => Boolean(parseError.value));
const runtimeMdcComponentMap = computed(() => {
  const raw = runtimeConfig.public.mdc?.components?.map;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  return raw;
});
const mergedComponents = computed(() => mergeMdcComponentMap({
  body: ast.value?.body,
  runtimeMap: runtimeMdcComponentMap.value,
  componentOverrides: props.components
}));
</script>

<template>
  <div :class="props.class">
    <MDCRenderer
      v-if="ast?.body"
      :body="ast.body"
      :components="mergedComponents"
      :data="ast.data"
      :prose="props.prose"
    />

    <div v-else-if="hasError" class="text-sm text-red-600">
      Content could not be rendered.
    </div>
  </div>
</template>
