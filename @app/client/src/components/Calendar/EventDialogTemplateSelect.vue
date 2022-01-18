<template>
  <n-popover
    trigger="manual"
    placement="bottom"
    :to="to"
    width="trigger"
    overlap
    :show="show"
    @update-show="focusTemplateSelect"
  >
    <template #trigger>
      <n-button
        w:m="b-2"
        w:w="full"
        w:p="y-4"
        size="large"
        dashed
        @click="
          () => {
            show = true;
            focusTemplateSelect();
          }
        "
      >
        <icon-carbon-template w:m="r-2" />
        Create from template
      </n-button>
    </template>
    <div ref="popover">
      <SearchSelect
        ref="templateSelect"
        :to="popover"
        autofocus
        placeholder="Select template"
        :search="SearchEventTemplatesDocument"
        :on-update:value="onSelect"
        :label-renderer="EventDialogTemplateSelectLabelRenderer"
      />
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import {
  CalendarEventByIdDocument,
  DetailedEventFragment,
  SearchEventTemplatesDocument,
} from '@app/graphql/dist/client';
import { useClientHandle } from '@urql/vue';
import { NButton, NPopover, NSelect } from 'naive-ui/lib';
import { PropType } from 'vue';

import EventDialogTemplateSelectLabelRenderer from './EventDialogTemplateSelectLabelRenderer.vue';

const props = defineProps({
  to: {
    type: [String, Object, Boolean] as PropType<string | boolean | HTMLElement>,
    default: undefined,
  },
});
const emit = defineEmits<{
  (e: 'select', template: DetailedEventFragment): void;
}>();

const handle = useClientHandle();
const popover = ref(null);
const show = ref(false);

const templateSelect = ref<InstanceType<typeof NSelect> | null>(null);

async function focusTemplateSelect() {
  await until(templateSelect).not.toBeNull();
  templateSelect.value!.$el.querySelector('.n-base-selection').click();
}

async function onSelect(value: number) {
  show.value = false;
  const { data } = await handle.client
    .query(CalendarEventByIdDocument, {
      id: value,
    })
    .toPromise();
  emit('select', data?.event!);
}
</script>
