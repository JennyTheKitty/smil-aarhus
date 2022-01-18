<template>
  <span>{{ (option.data as any).templateName }}</span>
</template>

<script setup lang="ts">
import { SelectMixedOption } from 'naive-ui/lib/select/src/interface';
import { PropType } from 'vue';

defineProps({
  option: { type: Object as PropType<SelectMixedOption>, required: true },
});
</script>
