<template>
  <a
    v-if="news"
    href="#"
    class="btn-focus-ring"
    w:rounded="lg"
    w:cursor="pointer"
    w:m="auto y-4 md:-y-16 md:b-16"
    w:shadow="lg"
    w:w="full"
    w:max-w="80vw md:2xl"
    w:display="block"
    w:overflow="hidden"
    w:z="3"
    w:pos="relative"
    w:border="2 pink-800"
  >
    <div w:bg="dark-800" w:w="full" w:p="4">
      <p w:font="medium" w:text="base pink-500">
        {{ t('home.latest-news') }}
      </p>
      <p w:font="medium" w:text="base md:xl white" w:m="b-2">
        {{ news.title }}
      </p>
      <p w:font="light" w:text="sm md:base gray-300 truncate">
        {{ firstLine }}
      </p>
    </div>
  </a>
</template>

<script setup lang="ts">
import { HomeNewsQueryDocument } from '@app/graphql/dist/client';

import { useTranslation } from '../../utils';

const { t, locale } = useI18n();

const jsdom = import.meta.env.SSR ? await import('jsdom') : null;

const { data } = await useQuery({
  query: HomeNewsQueryDocument,
});
const news = computed(() =>
  useTranslation(data.value?.newses?.nodes[0] || null, locale)
);

const firstLine = computed(() => {
  if (!news.value) return;
  let doc: Document;
  if (jsdom) {
    doc = new jsdom.JSDOM(news.value!.content).window.document;
  } else {
    doc = new DOMParser().parseFromString(news.value!.content, 'text/html');
  }
  return doc.querySelector('p')?.textContent;
});
</script>
