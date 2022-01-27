<template>
  <n-config-provider :theme="darkTheme" v-bind="$attrs">
    <slot />
  </n-config-provider>
</template>
<script setup lang="ts">
import { darkTheme } from 'naive-ui/lib/themes/dark';
</script>
