<template>
  <n-popconfirm
    trigger="manual"
    :show="show"
    negative-text="No, nevermind"
    positive-text="Yes"
    @negative-click="show = false"
    @positive-click="$emit('confirm')"
  >
    <template #trigger>
      <n-button @click="check">Cancel</n-button>
    </template>
    <span>You have unsaved changes. Are you sure you want to cancel?</span>
  </n-popconfirm>
</template>

<script setup lang="ts">
import { NButton, NPopconfirm } from 'naive-ui';

const emit = defineEmits(['confirm']);
const props = defineProps({ dirty: { type: Boolean, required: true } });

const show = ref(false);

function check() {
  if (props.dirty) {
    show.value = true;
  } else {
    emit('confirm');
  }
}

defineExpose({
  check,
});
</script>
