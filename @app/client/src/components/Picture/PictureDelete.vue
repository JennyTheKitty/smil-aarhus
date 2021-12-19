<template>
  <n-config-provider :theme="darkTheme">
    <n-popconfirm @positive-click="$emit('confirm')">
      <template #trigger>
        <button>
          <icon-mdi-trash class="icon-shadow" w:text="2xl" />
        </button>
      </template>
      {{ t('picture.delete.confirm') }}
    </n-popconfirm>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme, NConfigProvider, NPopconfirm } from 'naive-ui';

defineEmits(['confirm']);

const { t } = useI18n();
</script>
