<template>
  <main
    role="main"
    w:m="x-auto b-5 md:b-20 t-10"
    w:max-w="5xl"
    w:w="full"
    w:text="true-gray-100"
    w:flex="~ col"
    w:align="items-center"
    w:space="y-20"
  >
    <div
      v-for="news in newses"
      w:rounded="lg"
      w:bg="dark-800"
      w:w="full"
      w:shadow="lg"
      w:flex="~ col"
      w:p="x-40 y-5"
    >
      <h1 w:text="3xl" w:font="tracking-wider" w:m="b-2">{{ news.title }}</h1>
      <div class="content" w:text="base" v-html="news.content" />
      <span w:text="sm" w:m="t-5">
        <span w:font="light">Published</span>
        {{ dayjs(news.publishedAt).format('LL') }}
        <span v-if="news.updatedAt !== news.publishedAt">
          <br />
          <span w:font="light">Last updated: </span>
          {{ dayjs(news.updatedAt).format('LL') }}
        </span>
      </span>
    </div>
    <Pagination v-bind="paginationData" />
  </main>
</template>

<script setup lang="ts">
import { NewsesQueryDocument } from '@app/graphql/dist/client';
import dayjs from 'dayjs';
import { usePagination } from '../components/Pagination.vue';

const { t, locale } = useI18n();

const paginationData = usePagination({
  pageSize: 2,
});

const { data } = await useQuery({
  query: NewsesQueryDocument,
  variables: paginationData.urql,
});

watch(
  data,
  (data) => (paginationData.total.value = data!.newsesConnection!.totalCount),
  { immediate: true }
);

const newses = computed(() =>
  (data.value?.newsesConnection?.nodes || []).map((news) =>
    useTranslation(news, locale)
  )
);
</script>
