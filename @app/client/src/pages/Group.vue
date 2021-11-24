<template>
  <div>
    <Hero :jpeg="heroImgJpeg" :webp="heroImgWebp" :metadata="heroImgMetadata">
      <h1 class="title" w:font="bold" w:text="space-pre-line">
        Interessegrupper
      </h1>
    </Hero>
    <main
      role="main"
      w:m="x-auto b-5 md:b-20"
      w:max-w="3xl"
      w:w="full"
      w:text="true-gray-100"
      w:flex="~ col md:row"
      w:align="items-center"
    >
      <div w:flex="~ col" w:space="y-5" w:p="y-10" w:w="full">
        <i18n-link
          v-for="group in groups"
          :key="group.id"
          to="GROUPS"
          :params="{ slug: group.slug }"
          w:rounded="lg"
          w:bg="dark-300"
          w:w="full"
          w:h="64"
          w:shadow="lg"
          w:pos="relative"
          w:overflow="visible"
          class="group btn-focus-ring"
          w:flex="~"
          w:align="items-center"
        >
          <picture w:flex="shrink-0">
            <source
              :srcset="group.image.srcSetWebp"
              type="image/webp"
              sizes="20rem"
            />
            <source
              :srcset="group.image.srcSetJpeg"
              type="image/webp"
              sizes="20rem"
            />
            <img
              ref="img"
              alt=""
              :src="group.image.src"
              loading="lazy"
              w:w="60"
              w:h="48"
              w:object="cover"
              w:rounded="lg"
              w:shadow="lg"
              w:m="-l-12"
            />
          </picture>
          <div>
            <h3 w:text="2xl">{{ group.title }}</h3>
            <span>{{ group.shortDescription }}</span>
          </div>
        </i18n-link>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { HomeGroupsQueryDocument } from '@app/graphql/dist/client';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import heroImgMetadata from '../assets/images/papaioannou-kostas-tysecUm5HJA-unsplash.jpg?metadata=width;height';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import heroImgJpeg from '../assets/images/papaioannou-kostas-tysecUm5HJA-unsplash.jpg?w=300;900;1500;2000&format=jpeg&srcset';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import heroImgWebp from '../assets/images/papaioannou-kostas-tysecUm5HJA-unsplash.jpg?w=300;900;1500;2000&format=webp&srcset';
import { useTranslation } from '../utils';

const { t, locale } = useI18n();
const i18nRoute = inject(key.i18nRoute)!;

const { data: groupsData } = useQuery({
  query: HomeGroupsQueryDocument,
});
const groups = computed(() =>
  (groupsData.value?.groups?.nodes || []).map((group) =>
    useTranslation(group, locale)
  )
);
</script>

<style scoped>
.title {
  font-size: min(4rem, 7vw);
}
</style>
