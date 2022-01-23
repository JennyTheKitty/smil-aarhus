<template>
  <div w:m="x-auto t-10 b-10" w:text="white" w:max-w="7xl">
    <h1 w:text="center pink-500 3xl" w:m="b-5">{{ t('home.groups') }}</h1>
    <div w:pos="relative">
      <div ref="scroller" w:p="y-4 x-4" class="hidden-scroll-x">
        <div w:w="min-content">
          <div w:flex="~" w:space="x-5" w:p="x-10">
            <i18n-link
              v-for="group in groups"
              :key="group.id"
              to="GROUP"
              :params="{ slug: group.slug }"
              w:rounded="lg"
              w:bg="black"
              w:shadow="lg"
              w:pos="relative"
              w:overflow="hidden"
              class="group btn-focus-ring"
            >
              <picture>
                <source
                  :srcset="group.img.srcSetWebp"
                  type="image/webp"
                  sizes="20rem"
                />
                <source
                  :srcset="group.img.srcSetJpeg"
                  type="image/webp"
                  sizes="20rem"
                />
                <img
                  ref="img"
                  alt=""
                  :src="group.img.src"
                  :height="group.img.height"
                  :width="group.img.width"
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
                w:bg="black opacity-50 md:opacity-0 md:group-hover:opacity-50"
                w:transition="~ duration-100 all"
              ></div>
              <div
                w:pos="absolute top-0"
                w:m="t-10 md:t-60 md:group-hover:t-10"
                w:p="4"
                w:w="full"
                w:flex="~ col"
                w:transition="~ duration-200 all"
              >
                <span
                  w:text="white 3xl md:xl shadow-lg center md:group-hover:3xl space-nowrap"
                  w:w="full md:0 md:group-hover:full"
                  w:font="bold tracking-wider md:tracking-wide md:group-hover:tracking-wider"
                  w:transition="~ duration-200 all"
                >
                  {{ group.title }}
                </span>
                <span w:text="center" w:w="full" w:p="4">
                  {{ group.shortDescription }}
                </span>
              </div>
            </i18n-link>
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
        w:overflow="hidden"
        aria-hidden="true"
      >
        <a
          href="#"
          w:m="-l-4 r-4"
          @click.stop.prevent="scroller!.scrollBy({left: -scrollAmount, behavior: 'smooth'})"
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
        w:overflow="hidden"
      >
        <a
          href="#"
          w:m="l-4 -r-4"
          aria-hidden="true"
          @click.stop.prevent="scroller!.scrollBy({left: scrollAmount, behavior: 'smooth'})"
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

const { t, locale } = useI18n();

const { data: groupsData } = await useQuery({
  query: HomeGroupsQueryDocument,
});
const groups = computed(() =>
  (groupsData.value?.groups || []).map((group) => useTranslation(group, locale))
);

const scroller = ref<HTMLElement | null>(null);
const img = ref<HTMLElement | null>(null);
const { width: imgWidth } = useElementSize(img);
const { x, arrivedState } = useScroll(scroller);
const { width } = useElementSize(scroller);
const scrollAmount = computed(() => {
  console.log(width.value, img.value, imgWidth.value);
  let scroll = 0;
  scroll +=
    (imgWidth.value + 20) * Math.floor(width.value / (imgWidth.value + 20));
  return scroll;
});
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

.group,
.group img {
  width: min(calc(80vw - 40px), 300px);
  height: min(calc(90vw - 40px), 300px);
}
</style>
