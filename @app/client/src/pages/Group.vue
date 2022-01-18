<template>
  <div v-if="group">
    <teleport v-if="store.currentMember" to="#member-bar-left">
      <EditButton v-model:editing="editing" />
    </teleport>
    <GroupDialog v-model:isOpen="editing" :group="rawGroup!" />
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
      w:m="x-auto t-10 b-5 md:b-20"
      w:max-w="5xl"
      w:w="full"
      w:text="true-gray-100"
      w:align="items-center"
      w:p="x-8"
      class="grid gap-8 grid-cols-1 md:grid-cols-[2fr,1fr]"
    >
      <div class="content" w:text="base">
        <div v-html="group.description"></div>
      </div>
      <div w:bg="dark-800" w:p="4" w:border="rounded-xl">
        <h2 w:text="pink-500" w:font="bold tracking-wider">
          Upcoming {{ group.title }} events
        </h2>
        <EventsWidget v-if="events.length > 0" :events="events" />
        <p v-else>This group has no future events planned at the moment.</p>
        <p>
          <i18n-link to="CALENDAR" w:text="base underline">
            Go to the calendar</i18n-link
          >
          to see all events
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  GroupEventsDocument,
  GroupQueryDocument,
  TrLanguage,
} from '@app/graphql/dist/client';

import { useStore } from '../store';
import { useTranslation } from '../utils';

const { t, locale } = useI18n();
const route = useRoute();
const store = useStore();
const editing = ref(false);

const { data } = useQuery({
  query: GroupQueryDocument,
  variables: {
    slug: route.params.slug as string,
    preferredLanguageCode: locale.value.toUpperCase() as TrLanguage,
  },
});
const group = computed(() => useTranslation(data.value?.groupBySlug, locale));
const rawGroup = computed(() => data.value?.groupBySlug);

const { data: eventsData } = useQuery({
  query: GroupEventsDocument,
  variables: computed(() => ({
    groupId: group.value?.id,
  })),
  pause: computed(() => !group.value),
});
const events = computed(() =>
  (eventsData.value?.eventsByGroup?.nodes || []).map((event) =>
    useTranslation(event, locale)
  )
);
</script>

<style scoped>
.title {
  font-size: min(4rem, 7vw);
}
.subtitle {
  font-size: min(1.5rem, 4vw);
}
</style>
