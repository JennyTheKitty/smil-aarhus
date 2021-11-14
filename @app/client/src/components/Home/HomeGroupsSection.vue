<template>
  <div w:m="x-auto t-10 b-10" w:text="white" w:max-w="7xl">
    <h1 w:text="center pink-500 3xl" w:m="b-5">Interessegrupper</h1>
    <div w:pos="relative">
      <div ref="scroller" w:p="y-4 x-4" class="hidden-scroll-x">
        <div w:w="min-content">
          <div w:flex="~" w:space="x-5" w:p="x-10">
            <router-link
              v-for="group in groups"
              :key="group.value.id"
              :to="
                i18nRoute({
                  name: 'groups',
                  params: { slug: group.value.slug },
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
                  :srcset="group.value.image.srcSetWebp"
                  type="image/webp"
                  sizes="20rem"
                />
                <source
                  :srcset="group.value.image.srcSetJpeg"
                  type="image/webp"
                  sizes="20rem"
                />
                <img
                  alt=""
                  :src="group.value.image.src"
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
                  {{ group.value.title }}
                </span>
                <span w:text="center" w:w="full" w:p="4">
                  {{ group.value.shortDescription }}
                </span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div
        v-show="!arrivedState.left"
        w:pos="absolute left-0 top-0"
        w:w="16"
        w:h="full"
        w:flex="~ col"
        w:justify="center"
        w:gradient="to-l from-transparent to-dark-500"
        w:overflow="visible"
      >
        <a
          href="#"
          w:m="-l-4 r-4"
          @click.stop.prevent="scroller!.scrollBy({left: -1024, behavior: 'smooth'})"
        >
          <icon-mdi-chevron-left w:text="5xl" />
        </a>
      </div>
      <div
        v-show="!arrivedState.right"
        w:pos="absolute right-0 top-0"
        w:w="16"
        w:h="full"
        w:flex="~ col"
        w:justify="center"
        w:gradient="to-r from-transparent to-dark-500"
        w:overflow="visible"
      >
        <a
          href="#"
          w:m="l-4 -r-4"
          @click.stop.prevent="scroller!.scrollBy({left: 1024, behavior: 'smooth'})"
        >
          <icon-mdi-chevron-right w:text="5xl" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HomeGroupsQueryDocument } from '@app/graphql/dist/client';

import { useTranslation } from '../../utils';

const { locale } = useI18n();
const i18nRoute = inject(key.i18nRoute)!;

const { data: groupsData } = await useQuery({
  query: HomeGroupsQueryDocument,
});
const groups = computed(() =>
  (groupsData.value?.groups?.nodes || []).map((group) =>
    useTranslation(group, locale)
  )
);

const scroller = ref<HTMLElement | null>(null);
const { arrivedState } = useScroll(scroller);
</script>

<style scoped>
.hidden-scroll-x {
  overflow-x: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}
.hidden-scroll-x::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}
</style>
