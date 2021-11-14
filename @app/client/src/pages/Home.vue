<template>
  <div>
    <HomeHero />

    <a
      href="#"
      class="btn-focus-ring"
      w:rounded="lg"
      w:cursor="pointer"
      w:m="auto -y-16"
      w:shadow="lg"
      w:w="full"
      w:max-w="2xl"
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
        <p w:font="medium" w:text="xl white" w:m="b-2">Coronagenåbning!!</p>
        <p w:font="light" w:text="base gray-300">
          Efter at være lukket i lang tid, er SMIL Aarhus lokaler endelig åbne
          igen...
        </p>
      </div>
    </a>

    <main
      role="main"
      w:m="x-auto t-28 b-20"
      w:max-w="5xl"
      w:text="true-gray-100"
      w:flex="~"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div
        w:w="1/2"
        w:p="8 t-0"
        class="content"
        v-html="page.value?.content"
      ></div>
      <div w:w="1/2" w:flex="~ col" w:justify="center">
        <div w:grid="~ cols-2 gap-4">
          <div
            v-for="(img, i) in images"
            :key="i"
            w:w="full"
            w:max-h="full"
            w:border="1 pink-800 rounded-md"
            w:pos="relative"
            w:overflow="hidden"
            class="group"
          >
            <a
              w:pos="absolute"
              w:w="full"
              w:h="full"
              w:flex="~"
              w:border="rounded-md"
              w:bg="hover:black hover:opacity-25"
              w:transition="~ duration-200 all"
              href="#"
              tabindex="-1"
            ></a>
            <div
              w:pos="absolute bottom-0"
              w:m="-b-10 group-hover:b-0"
              w:w="full"
              w:h="10"
              w:flex="~"
              w:border="b-rounded-md"
              w:bg="black opacity-75"
              w:align="items-center"
              w:justify="center"
              w:pointer="none"
              w:transition="~ duration-200 all"
            >
              <span w:text="true-gray-100 center">Show more pictures</span>
            </div>
            <img
              class="object-cover"
              w:w="full"
              w:border="rounded-md"
              :src="img"
            />
          </div>
        </div>
        <div w:flex="~" w:justify="center" w:w="full">
          <a
            href="#"
            w:transform="~ scale-0 focus:scale-100"
            w:p="2"
            w:w="max-content"
            w:m="t-4"
            w:border="rounded-xl"
            class="btn-focus-ring"
          >
            Go to pictures page
          </a>
        </div>
      </div>
    </main>

    <div w:bg="dark-900">
      <div w:max-w="5xl" w:m="x-auto" w:p="y-10">
        <h1 w:text="center pink-500 3xl">Kommende Events</h1>
        <div w:flex="~" w:m="t-5" w:justify="center">
          <div v-if="specialEvent" w:w="1/2">
            <router-link
              :to="
                i18nRoute({
                  name: 'calendar',
                  params: { slug: specialEvent.slug },
                })
              "
              w:rounded="lg"
              w:bg="black"
              w:shadow="lg"
              w:w="75"
              w:h="75"
              w:pos="relative"
              w:overflow="hidden"
              class="group"
            >
              <picture>
                <source
                  :srcset="specialEvent.image?.srcSetWebp"
                  type="image/webp"
                  sizes="20rem"
                />
                <source
                  :srcset="specialEvent.image?.srcSetJpeg"
                  type="image/webp"
                  sizes="20rem"
                />
                <img
                  alt=""
                  :src="specialEvent.image?.src"
                  loading="lazy"
                  w:w="full"
                  w:h="full"
                  w:object="cover"
                  w:rounded="lg"
                />
              </picture>
              <div
                w:pos="absolute bottom-0"
                w:rounded="lg"
                w:w="full"
                w:h="full"
                w:gradient="to-b from-transparent via-transparent to-black"
                style="--tw-to-opacity: 0.8"
              ></div>
              <div
                w:pos="absolute bottom-0"
                w:rounded="lg"
                w:w="full"
                w:h="full"
                w:bg="black opacity-0 group-hover:opacity-50"
                w:transition="~ duration-100 all"
              ></div>
              <div
                w:pos="absolute top-0"
                w:m="t-60 group-hover:t-10"
                w:p="4"
                w:w="full"
                w:flex="~ col"
                w:transition="~ duration-200 all"
              >
                <span
                  w:text="white xl shadow-lg center group-hover:3xl space-nowrap"
                  w:w="group-hover:full 0"
                  w:font="bold tracking-wide group-hover:tracking-wider"
                  w:transition="~ duration-200 all"
                >
                  {{ specialEvent.title }}
                </span>
              </div>
            </router-link>
          </div>
          <div
            w:w="1/2"
            w:shadow="lg"
            w:overflow="hidden"
            w:flex="~ col"
            w:justify="center"
            w:text="white"
            w:p="x-10"
            w:border="rounded-xl"
          >
            <div w:bg="dark-800" w:w="full" w:p="4" w:border="rounded-xl">
              <HomeEventWidget :events="events" />
              <router-link
                :to="i18nRoute({ name: 'calendar' })"
                w:text="base underline"
                >{{ t('home.goto-calendar') }}</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <HomeGroupsSection />
  </div>
</template>

<script setup lang="ts">
import {
  HomeEventsQueryDocument,
  PageQueryDocument,
} from '@app/graphql/dist/client';

import img1 from '../assets/images/lokale.01.jpg';
import img2 from '../assets/images/lokale.04.jpg';
import img3 from '../assets/images/lokale.05.jpg';
import img4 from '../assets/images/lokale.06.jpg';
import { useTranslation } from '../utils';

const images = [img1, img2, img3, img4];

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
const specialEvent = useTranslation(
  eventsData.value?.specialEvents?.nodes[0] || null,
  locale
);

const events = computed(() =>
  (eventsData.value?.events?.nodes || [])
    .map((event) => useTranslation(event, locale))
    .filter((e) => e.value?.id !== specialEvent.value?.id)
);

const { data: pageData } = await useQuery({
  query: PageQueryDocument,
  variables: { name: 'home' },
});
const page = computed(() =>
  useTranslation(pageData.value?.page || null, locale)
);
</script>
