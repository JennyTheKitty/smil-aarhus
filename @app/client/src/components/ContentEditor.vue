<template>
  <CKEditor.component
    :editor="inline ? InlineEditor : ClassicEditor"
    :model-value="modelValue"
    :config="config"
    @update:modelValue="$emit('update:modelValue', $event)"
    @ready="onReady"
  ></CKEditor.component>
</template>

<script setup lang="ts">
import { ClassicEditor, InlineEditor } from '@app/editor';
import CKEditor from '@ckeditor/ckeditor5-vue';

defineProps<{
  modelValue: string;
  inline: boolean;
}>();
const emit = defineEmits(['update:modelValue', 'focus', 'blur']);

const config = {
  toolbar: {
    shouldNotGroupWhenFull: true,
  },
};

function onReady(editor: any) {
  editor.ui.focusTracker.on('change:isFocused', () => {
    if (editor.ui.focusTracker.isFocused) {
      emit('focus');
    } else {
      emit('blur');
    }
  });
}

onBeforeUnmount(() => {
  emit('blur');
});
</script>

<style>
.ck {
  --bezier: cubic-bezier(0.4, 0, 0.2, 1);

  --ck-spacing-large: 0;
  --ck-spacing-standard: 0.25rem;
  --ck-border-radius: 3px;

  /* Helper variables to avoid duplication in the colors. */
  --ck-custom-background: hsl(0, 0%, 19%);
  --ck-custom-foreground: hsl(0, 0%, 100%);
  --ck-custom-border: transparent;
  --ck-custom-white: hsl(0, 0%, 100%);

  --ck-color-base-background: var(--ck-custom-background);

  /* -- Overrides generic colors. ------------------------------------------------------------- */

  --ck-color-base-foreground: var(--ck-custom-background);
  --ck-color-focus-border: #7fe7c4;
  --ck-color-text: hsl(0, 0%, 98%);
  --ck-color-shadow-drop: hsla(0, 0%, 0%, 0.2);
  --ck-color-shadow-inner: hsla(0, 0%, 0%, 0.1);
  --ck-color-base-border: var(--ck-custom-background);

  --ck-focus-ring: 1px solid var(--ck-color-focus-border);

  /* -- Overrides the default .ck-button class colors. ---------------------------------------- */

  --ck-color-button-default-background: var(--ck-custom-background);
  --ck-color-button-default-hover-background: hsl(0, 0%, 30%);
  --ck-color-button-default-active-background: hsl(0, 0%, 25%);
  --ck-color-button-default-active-shadow: hsl(270, 2%, 23%);
  --ck-color-button-default-disabled-background: var(--ck-custom-background);

  --ck-color-button-on-background: hsl(0, 0%, 25%);
  --ck-color-button-on-hover-background: hsl(0, 0%, 30%);
  --ck-color-button-on-active-background: hsl(0, 0%, 25%);
  --ck-color-button-on-active-shadow: hsl(240, 3%, 19%);
  --ck-color-button-on-disabled-background: var(--ck-custom-foreground);

  --ck-color-button-action-background: hsl(168, 76%, 42%);
  --ck-color-button-action-hover-background: hsl(168, 76%, 38%);
  --ck-color-button-action-active-background: hsl(168, 76%, 36%);
  --ck-color-button-action-active-shadow: hsl(168, 75%, 34%);
  --ck-color-button-action-disabled-background: hsl(168, 76%, 42%);
  --ck-color-button-action-text: var(--ck-custom-white);

  --ck-color-button-save: hsl(120, 100%, 46%);
  --ck-color-button-cancel: hsl(15, 100%, 56%);

  /* -- Overrides the default .ck-dropdown class colors. -------------------------------------- */

  --ck-color-dropdown-panel-background: var(--ck-custom-background);
  --ck-color-dropdown-panel-border: var(--ck-custom-foreground);

  /* -- Overrides the default .ck-splitbutton class colors. ----------------------------------- */

  --ck-color-split-button-hover-background: var(
    --ck-color-button-default-hover-background
  );
  --ck-color-split-button-hover-border: var(--ck-custom-foreground);

  /* -- Overrides the default .ck-input class colors. ----------------------------------------- */

  --ck-color-input-background: var(--ck-custom-background);

  /* -- Overrides the default .ck-labeled-field-view class colors. ---------------------------- */

  --ck-color-labeled-field-label-background: var(--ck-custom-background);

  /* -- Overrides the default .ck-list class colors. ------------------------------------------ */

  --ck-color-list-background: var(--ck-custom-background);
  --ck-color-list-button-hover-background: var(--ck-color-base-foreground);
  --ck-color-list-button-on-background: var(--ck-color-base-active);
  --ck-color-list-button-on-background-focus: var(--ck-color-base-active-focus);
  --ck-color-list-button-on-text: var(--ck-color-base-background);

  /* -- Overrides the default .ck-balloon-panel class colors. --------------------------------- */

  --ck-color-panel-background: var(--ck-custom-background);
  --ck-color-panel-border: var(--ck-custom-border);

  /* -- Overrides the default .ck-toolbar class colors. --------------------------------------- */

  --ck-color-toolbar-background: var(--ck-custom-background);
  --ck-color-toolbar-border: var(--ck-custom-border);

  /* -- Overrides the default .ck-tooltip class colors. --------------------------------------- */

  --ck-color-tooltip-background: hsl(252, 7%, 14%);
  --ck-color-tooltip-text: hsl(0, 0%, 93%);

  /* -- Overrides the default colors used by the ckeditor5-link package. ---------------------- */

  --ck-color-link-default: hsl(190, 100%, 75%);
}
.ck .ck-editor__editable {
  caret-color: #63e2b7;
  transition: caret-color 0.3s var(--bezier), border-color 0.3s var(--bezier),
    background 0.3s var(--bezier);
  min-height: 5em;
  border-radius: var(--ck-border-radius) !important;
}
.ck .ck-editor__editable:hover {
  border: var(--ck-focus-ring) !important;
}
.ck .ck-editor__editable:focus {
  background: #202d28;
}
.ck .ck-toolbar {
  border-bottom: 1px solid #555 !important;
}
.ck .ck-balloon-panel {
  z-index: 100000;
}
</style>
