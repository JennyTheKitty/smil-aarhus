<template>
  <div>
    <Hero
      :jpeg="heroImgJpeg"
      :webp="heroImgWebp"
      :metadata="heroImgMetadata"
      :brightness="35"
    >
      <template #credits>
        <MagicLightImgCredits />
      </template>
      <h1
        class="title"
        w:w="full"
        w:font=" tracking-widest leading-[1.1]"
        w:text="space-pre-line shadow-lg"
      >
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

    <HomeNewsWidget />

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
        <Content id="5d70cca4-7d84-43eb-94f7-833a8d618b31" />
      </div>
      <div
        w:w="full md:1/2"
        w:flex="~ col"
        w:m="md:t-8"
        w:p="x-8 md:0"
        w:max-w="128"
      >
        <HomePicturesWidget />
      </div>
    </main>

    <HomeEventsSection />
    <HomeGroupsSection />
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import heroImgMetadata from '../assets/images/_S003654.jpg?metadata=width;height';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import heroImgJpeg from '../assets/images/_S003654.jpg?w=300;900;1500;2000&format=jpeg&srcset';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import heroImgWebp from '../assets/images/_S003654.jpg?w=300;900;1500;2000&format=webp&srcset';

const { t } = useI18n();

useHead({
  title: computed(() => 'Home - SMil Aarhus'),
  meta: [
    {
      name: `description`,
      content: computed(
        () =>
          'We are an association for people who are interested in and practice BDSM, sadomasochism, hard sex and a wide range of kinks in the same area.'
      ),
    },
  ],
});
</script>

<style scoped>
.title {
  font-size: min(4rem, 7vw);
}
</style>
