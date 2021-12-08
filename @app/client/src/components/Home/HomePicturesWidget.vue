<template>
  <div w:grid="~ cols-2 gap-4">
    <div
      v-for="picture in pictures"
      :key="picture.id"
      w:w="full"
      w:max-h="full"
      w:border="1 pink-800 rounded-md"
      w:pos="relative"
      w:overflow="hidden"
      class="group"
    >
      <i18n-link
        to="PICTURES"
        w:pos="absolute"
        w:w="full"
        w:h="full"
        w:flex="~"
        w:border="rounded-md"
        w:bg="hover:black hover:opacity-25"
        w:transition="~ duration-200 all"
        tabindex="-1"
        aria-hidden="true"
      ></i18n-link>
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
        <span w:text="true-gray-100 center">{{ t('home.more-pictures') }}</span>
      </div>
      <picture>
        <source
          :srcset="picture.img.srcSetWebp"
          type="image/webp"
          sizes="14rem"
        />
        <source
          :srcset="picture.img.srcSetJpeg"
          type="image/jpeg"
          sizes="14rem"
        />
        <img
          :src="picture.img.src"
          alt=""
          :height="picture.img.height"
          :width="picture.img.width"
          loading="lazy"
          class="object-cover"
          w:w="full"
          w:border="rounded-md"
        />
      </picture>
    </div>
  </div>
  <div w:flex="~" w:justify="center" w:w="full">
    <i18n-link
      to="PICTURES"
      w:transform="~ md:scale-0 md:focus:scale-100"
      w:p="2"
      w:w="max-content"
      w:m="t-4"
      w:border="rounded-xl"
      class="btn-focus-ring"
    >
      {{ t('home.see-all-pictures') }}
    </i18n-link>
  </div>
</template>

<script setup lang="ts">
import { HomeRandomPicturesQueryDocument } from '@app/graphql/dist/client';

const { t } = useI18n();

const { data } = await useQuery({
  query: HomeRandomPicturesQueryDocument,
});
const pictures = computed(() => data.value?.randomPictures?.nodes || []);
</script>
