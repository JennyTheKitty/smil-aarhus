<template>
  <div w:bg="dark-900">
    <div w:max-w="5xl" w:m="x-auto" w:p="y-10">
      <h1 w:text="center pink-500 3xl">{{ t('home.upcoming-events') }}</h1>
      <div
        w:flex="~ col md:row"
        w:m="t-5"
        w:justify="center"
        w:align="items-center"
      >
        <div
          v-if="specialEvent"
          w:w="full md:1/2"
          w:p="x-10"
          w:flex="~ col"
          w:justify="center"
          w:m="b-5 md:0"
          w:max-w="128"
        >
          <i18n-link
            to="CALENDAR"
            :params="{ slug: specialEvent.slug }"
            w:rounded="lg"
            w:bg="dark-800"
            w:shadow="lg"
            w:w="full"
            w:pos="relative"
            w:overflow="hidden"
            class="group btn-focus-ring"
            w:display="block"
            w:text="white"
            w:transition="~ transform duration-200"
            w:transform="~ hover:-translate-y-2"
          >
            <picture>
              <source
                :srcset="specialEvent.img?.srcSetWebp"
                type="image/webp"
                sizes="20rem"
              />
              <source
                :srcset="specialEvent.img?.srcSetJpeg"
                type="image/webp"
                sizes="20rem"
              />
              <img
                alt=""
                :src="specialEvent.img?.src"
                :height="specialEvent.img?.height"
                :width="specialEvent.img?.width"
                loading="lazy"
                w:w="full"
                w:h="60"
                w:overflow="visible"
                w:object="cover"
                w:rounded="t-lg"
              />
            </picture>
            <div w:flex="~" w:p="4" w:border="pink-600 t-2">
              <div
                w:flex="~ col shrink-0"
                w:w="20"
                w:text="right"
                w:p="r-3 y-1"
              >
                <ClientOnly>
                  <span w:text="base">{{
                    dayjs(specialEvent.startsAt).format('D MMM')
                  }}</span>
                  <span w:text="sm gray-400">
                    {{ dayjs(specialEvent.startsAt).format('ddd') }}
                  </span>
                </ClientOnly>
              </div>
              <div w:border="r-2 blue-500" w:m="y-1" />
              <div w:flex="~ col" w:p="l-3 y-1">
                <span w:text="base lg white">{{ specialEvent.title }}</span>
                <span w:text="sm gray-400">
                  <icon-mdi-clock-time-five-outline
                    w:display="inline-block"
                    w:m="b-0.5 -l-1 r-0.5"
                  />
                  <ClientOnly>
                    {{ dayjs(specialEvent.startsAt).format('LT') }} -
                    {{ dayjs(specialEvent.endsAt).format('LT') }}
                  </ClientOnly>
                </span>
              </div>
            </div>
          </i18n-link>
        </div>
        <div
          w:w="full md:1/2"
          w:shadow="lg"
          w:overflow="hidden"
          w:flex="~ col"
          w:justify="center"
          w:text="white"
          w:p="x-10"
          w:border="rounded-xl"
          w:max-w="128"
        >
          <div w:bg="dark-800" w:w="full" w:p="4" w:border="rounded-xl">
            <EventsWidget :events="events" />
            <i18n-link
              to="CALENDAR"
              w:text="base underline"
              w:m="t-1"
              w:p="3 sm:0"
              w:display="inline-block"
              >{{ t('home.goto-calendar') }}</i18n-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Event, HomeEventsQueryDocument } from '@app/graphql/dist/client';
import dayjs from 'dayjs';
import { Ref } from 'vue';

import { Translated, useTranslation } from '../../utils';

const { t, locale } = useI18n();

const now = new Date();
const today = new Date(
  Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
);

const { data: eventsData } = await useQuery({
  query: HomeEventsQueryDocument,
  variables: {
    startsAfter: today.toISOString(),
  },
});
const specialEvent = computed(() =>
  useTranslation(
    eventsData.value?.specialEvents ? eventsData.value.specialEvents[0] : null,
    locale
  )
);

const events = computed(() =>
  (eventsData.value?.events || [])
    .map((event) => useTranslation(event, locale))
    .filter((e) => e?.id !== specialEvent.value?.id)
) as unknown as Ref<Translated<Event>[]>;
</script>
