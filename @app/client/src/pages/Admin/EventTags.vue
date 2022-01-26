<template>
  <main
    role="main"
    w:m="x-auto b-5 md:b-20 t-10"
    w:max-w="3xl"
    w:w="full"
    w:text="true-gray-100"
    w:align="items-center"
  >
    <EventTagDialog
      v-if="editing"
      :tag="editing"
      :isOpen="!!editing"
      :create="!editing.id"
      @update:isOpen="(isOpen) => !isOpen && (editing = null)"
    />
    <table w:w="full" w:border="1 solid white">
      <thead>
        <th w:border="1 solid white">Title</th>
        <th w:border="1 solid white">Edit</th>
      </thead>
      <tbody>
        <tr v-for="tag of tags">
          <td w:border="1 solid gray-500">{{ tag.title }}</td>
          <td w:border="1 solid  gray-500">
            <button
              w:rounded="md"
              w:text="sm gray-300 hover:white"
              w:display="flex"
              w:align="items-center"
              class="btn-focus-ring"
              @click="
                editing = data?.eventTagsConnection?.nodes.find(
                  (n) => n.id === tag.id
                )!
              "
            >
              <icon-mdi-pencil />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <button
      w:rounded="md"
      w:text="sm gray-300 hover:white"
      w:display="flex"
      w:m="t-5"
      w:align="items-center"
      class="btn-focus-ring"
      @click="editing = {}"
    >
      <icon-mdi-plus />
      <span>Create new event category</span>
    </button>
  </main>
</template>

<script setup lang="ts">
import {
  EventTagsQueryDocument,
  EventTagsQueryQuery,
} from '@app/graphql/dist/client';
import { usePagination } from '../../components/Pagination.vue';

const { t, locale } = useI18n();

const editing = ref<null | Partial<
  NonNullable<
    NonNullable<EventTagsQueryQuery['eventTagsConnection']>['nodes'][number]
  >
>>(null);

const paginationData = usePagination({
  pageSize: 20,
});

const { data } = useQuery({
  query: EventTagsQueryDocument,
  variables: paginationData.urql,
});

watch(
  data,
  (data) => (paginationData.total.value = data!.eventTagsConnection!.totalCount)
);

const tags = computed(() =>
  (data.value?.eventTagsConnection?.nodes || []).map((tag) =>
    useTranslation(tag, locale)
  )
);
</script>
