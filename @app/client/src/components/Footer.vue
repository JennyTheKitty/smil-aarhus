<template>
  <div class="bg-dark-900 text-center text-sm py-4 text-true-gray-100">
    <div class="flex flex-col mx-auto max-w-7xl px-2 items-center md:px-8">
      <icon-smil-logo class="mb-4 text-7xl" />
      <span class="font-light">{{ t('address-title') }}</span>
      <span class="whitespace-pre-line">{{ t('address') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>
