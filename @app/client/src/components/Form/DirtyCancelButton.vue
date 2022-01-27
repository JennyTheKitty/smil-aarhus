<template>
  <n-popconfirm
    trigger="manual"
    :show="show"
    negative-text="No, nevermind"
    positive-text="Yes"
    :to="to"
    @negative-click="show = false"
    @positive-click="confirm"
  >
    <template #trigger>
      <n-button ref="trigger" @click="check" v-bind="$attrs">Cancel</n-button>
    </template>
    <span>You have unsaved changes. Are you sure you want to cancel?</span>
  </n-popconfirm>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui/lib/button';
import { PropType } from 'vue';

const emit = defineEmits(['confirm']);
const props = defineProps({
  dirty: { type: Boolean, required: true },
  to: {
    type: [String, Object, Boolean] as PropType<string | boolean | HTMLElement>,
    default: undefined,
  },
});

const show = ref(false);
const trigger = ref<InstanceType<typeof NButton> | null>(null);

async function check() {
  if (props.dirty) {
    trigger.value?.$el.scrollIntoView({ behavior: 'smooth' });
    show.value = true;
  } else {
    await confirm();
  }
}

async function confirm() {
  show.value = false;
  await nextTick();
  emit('confirm');
}

defineExpose({
  check,
});
</script>
