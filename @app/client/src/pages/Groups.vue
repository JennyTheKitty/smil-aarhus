<template>
  <div>
    <teleport v-if="store.currentMember" to="#member-bar-left">
      <CreateButton v-model:creating="creating" />
    </teleport>
    <GroupDialog v-model:isOpen="creating" :group="{}" :create="true" />
    <Hero
      :jpeg="heroImgJpeg"
      :webp="heroImgWebp"
      :metadata="heroImgMetadata"
      :brightness="100"
    >
      <template #credits>
        <MagicLightImgCredits />
      </template>
      <h1 class="title" w:font="bold" w:text="space-pre-line shadow-lg">
        Interessegrupper
      </h1>
    </Hero>
    <main
      role="main"
      w:m="sm:x-auto b-5 md:b-20"
      w:max-w="3xl"
      w:w="full"
      w:p="x-2 sm:0"
      w:text="true-gray-100"
      w:flex="~ col md:row"
      w:align="items-center"
    >
      <div w:flex="~ col" w:space="y-5" w:p="y-10" w:w="full">
        <i18n-link
          v-for="group in groups"
          :key="group.id"
          to="GROUP"
          :params="{ id: fromUUID(group.id), slug: group.slug }"
          w:rounded="lg"
          w:bg="dark-800"
          w:w="full"
          w:h="sm:64"
          w:shadow="lg"
          w:pos="relative"
          w:overflow="visible"
          class="group btn-focus-ring"
          w:flex="~ col sm:row"
          w:align="sm:items-center"
        >
          <picture w:flex="shrink-0" w:display="hidden sm:block">
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
              loading="lazy"
              w:w="30 sm:60"
              w:h="30 sm:48"
              w:object="cover"
              w:rounded="lg"
              w:shadow="lg"
              w:m="l-4 sm:-l-12"
            />
          </picture>
          <picture w:display="sm:hidden block">
            <source
              :srcset="group.img.srcSetWebp"
              type="image/webp"
              sizes="400px"
            />
            <source
              :srcset="group.img.srcSetJpeg"
              type="image/webp"
              sizes="400px"
            />
            <img
              alt=""
              :src="group.img.src"
              :height="group.img.height"
              :width="group.img.width"
              loading="lazy"
              w:w="full"
              w:h="50"
              w:object="cover"
              w:rounded="t-lg"
              w:border="pink-600 b-2"
            />
          </picture>
          <div
            w:flex="~ col"
            w:p="r-4 b-4 t-8 l-4 sm:l-0"
            w:h="full"
            w:w="full"
          >
            <div>
              <h3 w:text="3xl">{{ group.title }}</h3>
              <span w:text="lg" w:font="light">{{
                group.shortDescription
              }}</span>
            </div>
            <div w:flex="grow"></div>
            <div w:flex="~" w:align="items-center" w:space="x-4">
              <div v-if="group.isOpen" w:flex="~" w:align="items-center">
                <icon-mdi-door-open w:text="xl" w:m="r-2" />
                <span>Åben gruppe</span>
              </div>
              <div v-else w:flex="~" w:align="items-center">
                <icon-mdi-door-closed-lock w:text="xl" w:m="r-2" />
                <span>Lukket gruppe</span>
              </div>
              <div w:flex="~" w:align="items-center">
                <icon-mdi-calendar-clock w:text="xl" w:m="r-2" />
                <span>{{ group.activity }}</span>
              </div>
              <div w:flex="grow"></div>
              <button
                w:border="rounded-xl"
                w:shadow="lg"
                w:bg="pink-800"
                w:text="white xl"
                w:p="y-1 x-2"
              >
                Læs mere
              </button>
            </div>
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
import heroImgMetadata from '../assets/images/groups-header.jpg?metadata=width;height';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import heroImgJpeg from '../assets/images/groups-header.jpg?w=300;900;1500;2000&format=jpeg&srcset';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import heroImgWebp from '../assets/images/groups-header.jpg?w=300;900;1500;2000&format=webp&srcset';
import { useTranslation } from '../utils';

const creating = ref(false);

const GroupDialog = useWaitImportComponent(
  creating,
  () => import('../components/GroupDialog.vue')
);

const { t, locale } = useI18n();
const store = useStore();
const { fromUUID } = useShort();

const { data: groupsData } = await useQuery({
  query: HomeGroupsQueryDocument,
});
const groups = computed(() =>
  (groupsData.value?.groups || []).map((group) => useTranslation(group, locale))
);
</script>

<style scoped>
.title {
  font-size: min(4rem, 7vw);
}
</style>
