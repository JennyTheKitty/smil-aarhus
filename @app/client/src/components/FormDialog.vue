<template>
  <BaseDialog :is-open="isOpen" @update:is-open="() => cancelButton!.check()">
    <div ref="root">
      <div
        w:w="5xl"
        w:shadow="lg"
        w:pos="relative"
        w:border="2 pink-800 rounded-lg"
        w:bg="dark-800"
        w:text="white"
        w:p="4"
        w:max-h="90vh"
        w:overflow="scroll"
      >
        <DialogTitle class="sr-only">{{ title }}</DialogTitle>
        <n-config-provider :theme="darkTheme">
          <n-form ref="form" :model="model" v-bind="formProps">
            <slot :root="root"></slot>
            <n-form-item w:m="t-6" :show-feedback="false" :show-label="false">
              <input type="submit" w:display="hidden" />
              <DirtyCancelButton
                ref="cancelButton"
                :dirty="dirty"
                :to="root!"
                @confirm="$emit('update:isOpen', false)"
              />
              <div w:flex="grow"></div>
              <slot name="create"></slot>
            </n-form-item>
          </n-form>
        </n-config-provider>
      </div>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import {
  darkTheme,
  FormInst,
  FormProps,
  NConfigProvider,
  NForm,
  NFormItem,
} from 'naive-ui/lib';
import { PropType } from 'vue';

import DirtyCancelButton from './Form/DirtyCancelButton.vue';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, required: true },
  model: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
  formProps: {
    type: Object as PropType<FormProps>,
    default: () => {},
  },
});
const emit = defineEmits(['update:isOpen', 'open', 'close']);

const root = ref<HTMLDivElement | null>(null);
const dirty = ref(false);
let dirtyWatchStop: () => void = () => {};
const cancelButton = ref<typeof DirtyCancelButton | null>(null);
const form = ref<FormInst | null>(null);

watch(
  () => props.isOpen,
  async (isOpen) => {
    dirtyWatchStop();
    if (isOpen) {
      emit('open');
      dirty.value = false;
      dirtyWatchStop = watch(
        toRef(props, 'model'),
        () => {
          dirtyWatchStop();
          dirty.value = true;
        },
        { deep: true }
      );
    } else {
      emit('close');
    }
  },
  { immediate: true }
);

defineExpose({ form });
</script>
