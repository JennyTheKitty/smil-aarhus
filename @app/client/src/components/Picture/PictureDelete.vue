<template>
  <NaiveWrapper>
    <n-popconfirm @positive-click="$emit('confirm')">
      <template #trigger>
        <button>
          <icon-mdi-trash class="icon-shadow" w:text="2xl" />
        </button>
      </template>
      {{ t('picture.delete.confirm') }}
    </n-popconfirm>
  </NaiveWrapper>
</template>

<script setup lang="ts">
defineEmits(['confirm']);

const { t } = useI18n();
</script>
