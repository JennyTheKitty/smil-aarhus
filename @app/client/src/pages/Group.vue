<template>
  <div v-if="group">
    <Hero
      :jpeg="group.img.srcSetJpeg"
      :webp="group.img.srcSetWebp"
      :metadata="{ width: group.img.width, height: group.img.height }"
      :brightness="50"
    >
      <span class="subtitle" w:font="light" w:text="space-pre-line">
        SMil Aarhus Interessegruppe
      </span>
      <h1 class="title" w:font="bold" w:text="space-pre-line" w:m="!0">
        {{ group.title }}
      </h1>
      <div w:align="items-center" w:space="x-4" w:display="hidden md:flex">
        <div v-if="group.isOpen" w:flex="~" w:align="items-center">
          <icon-mdi-door-open w:text="xl" w:m="r-2" />
          <span>Åben gruppe</span>
        </div>
        <div v-else w:flex="~" w:align="items-center">
          <icon-mdi-door-closed-lock w:text="xl" w:m="r-2" />
          <span>Lukket gruppe</span>
        </div>
        <div w:flex="~" w:align="items-center">
          <icon-mdi-calendar-clock w:text="xl" w:m="r-2" />
          <span>{{ group.activity }}</span>
        </div>
      </div>
    </Hero>
    <main
      role="main"
      w:m="x-auto b-5 md:b-20"
      w:max-w="3xl"
      w:w="full"
      w:text="true-gray-100"
      w:flex="~ col md:row"
      w:align="items-center"
    ></main>
  </div>
</template>

<script setup lang="ts">
import { HomeGroupsQueryDocument } from '@app/graphql/dist/client';

import { useTranslation } from '../utils';

const { t, locale } = useI18n();
const route = useRoute();

const { data: groupsData } = useQuery({
  query: HomeGroupsQueryDocument,
});
const groups = computed(() =>
  (groupsData.value?.groups?.nodes || []).map((group) =>
    useTranslation(group, locale)
  )
);
const group = computed(() => {
  return groups.value.find((group) => group.slug === route.params.slug);
});
</script>

<style scoped>
.title {
  font-size: min(4rem, 7vw);
}
.subtitle {
  font-size: min(1.5rem, 4vw);
}
</style>
