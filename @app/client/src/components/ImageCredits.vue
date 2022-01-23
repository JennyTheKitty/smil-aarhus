<template>
  <div :title="t('img-credits')" w:flex="~ row">
    <icon-mdi-message-image-outline w:text="lg" w:m="r-2 t-0.5" />
    <slot><div v-html="content"></div></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  content: { type: String, default: () => null },
});

const { t } = useI18n();
</script>
