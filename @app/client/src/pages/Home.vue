<template>
  <div>
    <Hero :jpeg="heroImgJpeg" :webp="heroImgWebp" :metadata="heroImgMetadata">
      <h1 class="title" w:font="bold" w:text="space-pre-line">
        {{ t('hero.title') }}
      </h1>
      <span w:display="hidden md:block" w:text="base">{{
        t('hero.subtitle')
      }}</span>
      <div w:flex="~ row" w:space="x-10" w:p="t-1 sm:t-5">
        <button class="btn-hero">
          <span w:text="uppercase" w:font="tracking-wider">{{
            t('hero.buttons.signup')
          }}</span>
        </button>
      </div>
    </Hero>

    <a
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
          Coronagenåbning!!
        </p>
        <p w:font="light" w:text="sm md:base gray-300">
          Efter at være lukket i lang tid, er SMIL Aarhus lokaler endelig åbne
          igen...
        </p>
      </div>
    </a>

    <main
      role="main"
      w:m="x-auto b-5 md:b-20"
      w:max-w="5xl"
      w:text="true-gray-100"
      w:flex="~ col md:row"
      w:align="items-center"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div w:w="full md:1/2" w:p="x-8 t-0">
        <suspense><Content name="home" /></suspense>
      </div>
      <div
        w:w="full md:1/2"
        w:flex="~ col"
        w:m="md:t-8"
        w:p="x-8 md:0"
        w:max-w="128"
      >
        <suspense>
          <HomePicturesWidget />
        </suspense>
      </div>
    </main>

    <suspense>
      <HomeEventsSection />
    </suspense>
    <suspense>
      <HomeGroupsSection />
    </suspense>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import heroImgMetadata from '../assets/images/artem-labunsky-whsB1P4Kblc-unsplash.jpg?metadata=width;height';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import heroImgJpeg from '../assets/images/artem-labunsky-whsB1P4Kblc-unsplash.jpg?w=300;900;1500;2000&format=jpeg&srcset';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import heroImgWebp from '../assets/images/artem-labunsky-whsB1P4Kblc-unsplash.jpg?w=300;900;1500;2000&format=webp&srcset';

const { t } = useI18n();

useHead({
  title: computed(() => 'Home - SMil Aarhus'),
  meta: [
    {
      name: `description`,
      content: computed(() => ''),
    },
  ],
});
</script>

<style scoped>
.title {
  font-size: min(4rem, 7vw);
}
</style>
