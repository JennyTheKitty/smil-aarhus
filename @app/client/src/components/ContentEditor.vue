<template>
  <CKEditor.component
    :editor="InlineEditor"
    :model-value="modelValue"
    :config="config"
    @update:modelValue="$emit('update:modelValue', $event)"
  ></CKEditor.component>
</template>

<script setup lang="ts">
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import CKEditor from '@ckeditor/ckeditor5-vue';

const config = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'numberedList',
      'bulletedList',
      '|',
      'undo',
      'redo',
    ],
    shouldNotGroupWhenFull: true,
  },
};

defineProps<{
  modelValue: string;
}>();
defineEmits(['update:modelValue']);
</script>

<style>
:root {
  --ck-spacing-large: 0;
  --ck-spacing-standard: 0.25rem;
}
</style>
