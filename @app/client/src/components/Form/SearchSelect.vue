<template>
  <n-select
    v-bind="$props"
    :options="options"
    :loading="loading"
    multiple
    filterable
    clearable
    remote
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
import {
  EventTagByIdDocument,
  GroupByIdDocument,
  SearchEventTagsDocument,
  SearchGroupsDocument,
} from '@app/graphql/dist/client';
import { useClientHandle } from '@urql/vue';
import { NSelect } from 'naive-ui/lib';

import { Translateable, useTranslation } from '../../utils';

const { locale } = useI18n();

const searchDocument = {
  group: SearchGroupsDocument,
  eventTag: SearchEventTagsDocument,
} as const;

const getDocument = {
  group: GroupByIdDocument,
  eventTag: EventTagByIdDocument,
} as const;

const searchRootProperty = {
  group: 'searchGroups',
  eventTag: 'searchEventTags',
};

const getRootProperty = {
  group: 'group',
  eventTag: 'eventTag',
};

const props = defineProps({
  ...NSelect.props,
  type: { type: String, required: true },
});

const handle = useClientHandle();

let stop = () => {};

const options = ref<{ label: string; value: number }[]>([]);
const loading = ref(false);

stop = watch(
  () => props.value,
  async () => {
    stop();
    loading.value = true;
    options.value = await Promise.all(
      props.value.map(async (id: number) => {
        const { data } = await handle.client
          .query(getDocument[props.type], { id })
          .toPromise();
        const value = data[getRootProperty[props.type]] as {
          id: any;
        } & Translateable;
        return {
          value: value.id,
          label: useTranslation(value, locale)!.title,
        };
      })
    );
    await nextTick();
    options.value = [];
    loading.value = false;
  },
  { immediate: true }
);

async function handleSearch(query: string) {
  loading.value = true;
  const { data } = await handle.client
    .query(searchDocument[props.type], {
      query,
    })
    .toPromise();
  options.value =
    data && data[searchRootProperty[props.type]]
      ? data[searchRootProperty[props.type]].nodes.map(
          (
            value: {
              id: any;
            } & Translateable
          ) => {
            return {
              value: value.id,
              label: useTranslation(value, locale)!.title,
            };
          }
        )
      : [];
  loading.value = false;
}
</script>
