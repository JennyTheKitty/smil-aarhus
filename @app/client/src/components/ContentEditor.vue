<template>
  <CKEditor.component
    :editor="Editor"
    :model-value="modelValue"
    :config="config"
    @update:modelValue="$emit('update:modelValue', $event)"
  ></CKEditor.component>
</template>

<script setup lang="ts">
import CKEditor from '@ckeditor/ckeditor5-vue';

import Editor from '../ckeditor';

const config = {
  toolbar: {
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
