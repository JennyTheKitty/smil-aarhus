<template>
  <button
    w:rounded="md"
    w:font="medium"
    w:space="x-2"
    w:text="sm gray-300 hover:white"
    w:p="y-2 x-3"
    w:display="flex"
    w:align="center"
    class="btn-focus-ring"
    @click="emit('update:creating', !creating)"
  >
    <span>
      {{ creating ? t('stop-creating') : t('create') }}
    </span>
    <icon-mdi-pencil />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  creating: { type: Boolean, required: true },
});

const emit = defineEmits(['update:creating']);

const { t } = useI18n();
</script>
