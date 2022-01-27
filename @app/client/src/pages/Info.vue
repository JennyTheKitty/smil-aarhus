<template>
  <div
    w:m="x-auto t-10 b-5 md:b-20"
    w:max-w="7xl"
    w:w="full"
    w:align="items-start"
    w:p="x-8"
    class="grid gap-16 grid-cols-1 md:grid-cols-[350px,1fr]"
  >
    <suspense><InfoSidebar class="hidden md:block" /></suspense>
    <main role="main" v-if="infoPage" w:text="true-gray-100">
      <h1 w:text="4xl" w:font="tracking-wider" w:m="b-2">
        {{ infoPage.title }} - {{ infoPage.subtitle }}
      </h1>
      <suspense><Content :id="infoPage.id" /></suspense>
    </main>
  </div>
</template>

<script setup lang="ts">
import { InfoPageQueryDocument } from '@app/graphql/dist/client';

const route = useRoute();
const { locale } = useI18n();
const { toUUID } = useShort();

const { data } = await useQuery({
  query: InfoPageQueryDocument,
  variables: computed(() => ({
    id: toUUID((route.params.id as string) || ''),
  })),
});
const infoPage = computed(() => useTranslation(data.value?.infoPage, locale));

useHead({
  title: computed(
    () => `${infoPage.value?.title} - ${infoPage.value?.subtitle} - SMil Aarhus`
  ),
  meta: [
    {
      name: `description`,
      content: computed(() => ''),
    },
  ],
});
</script>
