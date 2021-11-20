<template>
  <div ref="hero" class="home-hero" w:h="full" w:pos="relative" w:m="-t-16">
    <picture>
      <source
        srcset="
          ../../assets/images/artem-labunsky-whsB1P4Kblc-unsplash.jpg?w=300;900;1500;2000&format=webp&srcset&metadata=width;height
        "
        type="image/webp"
        sizes="100vw"
      />
      <source
        srcset="
          ../../assets/images/artem-labunsky-whsB1P4Kblc-unsplash.jpg?w=300;900;1500;2000&format=jpg&srcset
        "
        type="image/webp"
        sizes="100vw"
      />
      <img
        alt
        class="home-hero"
        w:object="cover"
        w:w="full"
        w:max-h="50vh"
        w:filter="~ brightness-35"
        v-bind="imgDimensions"
      />
    </picture>
    <div
      w:flex="~ col"
      w:h="full"
      w:w="full"
      w:pos="top-0 absolute"
      w:align="items-center"
      w:justify="center"
      w:p="4 t-12 md:t-4"
      w:space="y-1 sm:y-5"
      w:text="white center"
      w:border="b-4 b-pink-800"
    >
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
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignores
// eslint-disable-next-line import/no-unresolved
import imgDimensions from '../../assets/images/artem-labunsky-whsB1P4Kblc-unsplash.jpg?metadata=width;height';

const { t } = useI18n();
const hero = ref(null);

const { height } = useElementSize(hero);
const heroHeight = inject(key.heroHeight);
watch(height, () => {
  heroHeight!.value = height.value;
});
</script>

<style scoped>
.home-hero {
  max-height: calc(64px + 50vh);
}
.title {
  font-size: min(4rem, 7vw);
}
</style>
