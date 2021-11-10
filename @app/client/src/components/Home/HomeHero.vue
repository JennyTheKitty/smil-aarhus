<template>
  <div w:h="full" w:rounded="2xl" w:m="5" w:max-h="50vh" w:pos="relative">
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
        w:object="cover"
        w:rounded="2xl"
        w:w="full"
        w:max-h="50vh"
        w:filter="~ brightness-25"
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
      w:p="4"
      w:space="y-1 sm:y-5"
      w:text="white center"
    >
      <h1 w:font="bold" w:text="space-pre-line 2xl sm:4xl md:5xl lg:6xl">
        {{ t('hero.title') }}
      </h1>
      <span w:text="sm sm:base">{{ t('hero.subtitle') }}</span>
      <div w:flex="~ row" w:space="x-10" w:p="t-1 sm:t-5">
        <button class="btn-hero">
          <span>{{ t('hero.buttons.signup') }}</span>
        </button>
        <button class="btn-hero">
          <span>{{ t('hero.buttons.pictures') }}</span>
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
</script>
