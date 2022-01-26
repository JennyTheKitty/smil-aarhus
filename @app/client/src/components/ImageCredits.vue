<template>
  <div :title="t('img-credits')" w:flex="~ row" class="img-credits">
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

<style scoped>
.img-credits ::v-deep(a) {
  text-decoration: underline;
}
</style>
