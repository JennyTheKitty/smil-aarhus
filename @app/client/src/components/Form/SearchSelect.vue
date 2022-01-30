<template>
  <n-select
    v-bind="{ ...$props, ...$attrs }"
    :options="options"
    :loading="loading"
    :multiple="!!props.get"
    filterable
    clearable
    remote
    :render-label="renderLabel"
    @search="handleSearch"
    @focus="handleSearch(lastQuery)"
  />
</template>

<script setup lang="ts">
import { Exact } from '@app/graphql/dist/client';
import { TypedDocumentNode, useClientHandle } from '@urql/vue';
import { NSelect } from 'naive-ui';
import { RenderLabel } from 'naive-ui/_internal/select-menu/src/interface';
import { Component, PropType } from 'vue';

import { Translateable, useTranslation } from '../../utils';
import SearchSelectLabelRendererTitle from './SearchSelectLabelRendererTitle.vue';

const { locale } = useI18n();

type Query = { __typename?: string } & {
  [root: string]: {
    nodes: {
      id: string;
      translations: { languageCode: string; title: string }[];
    }[];
  };
};

const props = defineProps({
  ...NSelect.props,
  search: {
    type: Object as PropType<
      TypedDocumentNode<
        Query,
        Exact<{
          query: string;
        }>
      >
    >,
    required: true,
  },
  get: {
    type: Object as PropType<
      TypedDocumentNode<
        Query,
        Exact<{
          id: number;
        }>
      >
    >,
    default: () => undefined,
  },
  labelRenderer: {
    type: Object as PropType<Component>,
    default: () => SearchSelectLabelRendererTitle,
  },
});

const handle = useClientHandle();

let stop = () => {};

const options = ref<{ label: string; value: number }[]>([]);
const loading = ref(false);

if (props.get) {
  stop = watch(
    () => props.value,
    async () => {
      stop();
      loading.value = true;
      options.value = await Promise.all(
        props.value.map(async (id: number) => {
          const { data } = await handle.client
            .query(props.get, { id })
            .toPromise();
          const value = data[Object.keys(data)[0]];
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
}

const lastQuery = ref('');

async function handleSearch(query: string) {
  stop();
  lastQuery.value = query;
  loading.value = true;
  const { data } = await handle.client
    .query(props.search, {
      query,
    })
    .toPromise();
  options.value =
    data && data[Object.keys(data)[0]]
      ? data[Object.keys(data)[0]].map(
          (
            value: {
              id: any;
            } & Translateable
          ) => {
            return {
              value: value.id,
              label: useTranslation(value, locale)!.title,
              data: value,
            };
          }
        )
      : [];
  loading.value = false;
}

const renderLabel: RenderLabel = (option) => {
  return h(props.labelRenderer, { option });
};
</script>
