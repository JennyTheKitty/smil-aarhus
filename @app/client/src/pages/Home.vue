<template>
  <div>
    <HomeHero />

    <div w:m="x-auto" w:text="white" w:max-w="7xl">
      <div w:flex="~ col lg:row" w:p="y-4 x-4">
        <div w:w="lg:7/10">
          <a
            href="#"
            class="btn-focus-ring"
            w:rounded="lg"
            w:cursor="pointer"
            w:m="auto"
            w:shadow="lg"
            w:w="full"
            w:max-w="2xl"
            w:display="block"
            w:overflow="hidden"
          >
            <div w:bg="dark-800" w:w="full" w:p="4">
              <p w:font="medium" w:text="base pink-500">
                {{ t('home.latest-news') }}
              </p>
              <p w:font="medium" w:text="xl white" w:m="b-2">
                Coronagenåbning!!
              </p>
              <p w:font="light" w:text="base gray-300">
                Efter at være lukket i lang tid, er SMIL Aarhus lokaler endelig
                åbne igen...
              </p>
            </div>
          </a>
          <main
            role="main"
            w:rounded="lg"
            w:bg="dark-800"
            w:shadow="lg"
            w:m="t-5"
            w:w="full"
            w:p="8"
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="content" v-html="page.value?.content"></div>
          </main>

          <div w:flex="~" w:space="x-5">
            <div
              v-for="group in groups"
              :key="group.value!.id"
              w:rounded="lg"
              w:bg="dark-800"
              w:shadow="lg"
              w:m="t-5"
              w:w="60"
            >
              <picture>
                <source
                  :srcset="group.value!.image.srcSetWebp"
                  type="image/webp"
                  sizes="15rem"
                />
                <source
                  :srcset="group.value!.image.srcSetJpeg"
                  type="image/webp"
                  sizes="15rem"
                />
                <img
                  alt=""
                  :src="group.value!.image.src"
                  loading="lazy"
                  w:w="full"
                  w:h="30"
                  w:object="cover"
                  w:rounded="t-lg"
                />
              </picture>
              <div w:p="y-2 x-4" w:flex="~ col">
                <span w:font="medium" w:text="sm pink-500"
                  >Interessegruppe
                </span>
                <span w:text="base"> {{group.value!.title}}</span>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span w:text="sm gray-500" v-html="group.value!.description" />
              </div>
            </div>
          </div>
        </div>
        <aside
          w:m="x-auto"
          w:w="full lg:3/10"
          w:max-w="2xl"
          w:p="lg:l-4 <lg:t-4"
        >
          <div w:flex="~ col" w:space="y-5" w:w="full">
            <div
              v-if="specialEvent"
              w:rounded="lg"
              w:shadow="lg"
              w:overflow="hidden"
            >
              <div w:bg="dark-800" w:w="full" w:p="4">
                <p w:font="medium" w:text="base pink-500">
                  {{ t('home.special-events') }}
                </p>
                <HomeEventWidget :events="[specialEvent]" />
              </div>
            </div>
            <div w:rounded="lg" w:shadow="lg" w:overflow="hidden">
              <div w:bg="dark-800" w:w="full" w:p="4">
                <p w:font="medium" w:text="base pink-500">
                  {{ t('home.upcoming-events') }}
                </p>
                <HomeEventWidget :events="events" />
                <router-link
                  :to="i18nRoute({ name: 'calendar' })"
                  w:text="base underline"
                  >{{ t('home.goto-calendar') }}</router-link
                >
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  HomeEventsQueryDocument,
  HomeGroupsQueryDocument,
  PageQueryDocument,
} from '@app/graphql/dist/client';

import { useTranslation } from '../utils';

const { t, locale } = useI18n();
const i18nRoute = inject(key.i18nRoute)!;

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
  useTranslation(eventsData.value?.specialEvents?.nodes[0] || null, locale)
);
const events = computed(() =>
  (eventsData.value?.events?.nodes || []).map((event) =>
    useTranslation(event, locale)
  )
);

const { data: pageData } = await useQuery({
  query: PageQueryDocument,
  variables: { name: 'home' },
});
const page = computed(() =>
  useTranslation(pageData.value?.page || null, locale)
);

const { data: groupsData } = await useQuery({
  query: HomeGroupsQueryDocument,
});
const groups = computed(() =>
  (groupsData.value?.groups?.nodes || []).map((group) =>
    useTranslation(group, locale)
  )
);
</script>
