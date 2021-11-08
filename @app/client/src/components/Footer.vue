<template>
  <div w:bg="dark-900" w:text="center sm true-gray-100" w:p="y-4">
    <div
      w:flex="~ col"
      w:m="x-auto"
      w:max-w="7xl"
      w:p="x-2 md:x-8"
      w:align="items-center"
    >
      <icon-smil-logo w:m="b-4" w:text="7xl" />
      <span w:font="light">{{ t('address-title') }}</span>
      <span w:text="space-pre-line">{{ t('address') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>
