<template>
  <div
    w:w="full"
    w:shadow="lg"
    w:overflow="hidden"
    w:flex="~ col"
    w:justify="center"
    w:text="white"
    w:p="l-4 y-2"
    w:bg="dark-800"
    w:border="rounded-xl 2 pink-800"
  >
    <i18n-link
      v-for="(page, i) in infoPages"
      to="INFO"
      :params="{ id: fromUUID(page.id), slug: page.slug }"
      :key="page.id"
      w:rounded="md"
      w:flex="~"
      w:m="y-1"
      w:p="2"
      w:align="items-center"
      class="group btn-focus-ring"
    >
      <span
        class="iconify"
        :data-icon="page.icon"
        w:text="3xl"
        w:m="r-2"
      ></span>
      <div w:flex="~ col">
        <span w:font="medium" w:text="sm gray-300 group-hover:white">{{
          page.title
        }}</span>
        <span w:font="light" w:text="sm gray-200">{{ page.subtitle }}</span>
      </div>
      <div w:flex="grow" />
      <div
        v-if="store.currentMember"
        w:h="min-content"
        w:flex="~ col"
        w:m="r-2"
      >
        <button
          :disabled="i === 0"
          class="btn-focus-ring up-down-btn"
          @click.prevent
        >
          <icon-mdi-chevron-up />
        </button>
        <button
          :disabled="i === infoPages.length - 1"
          class="btn-focus-ring up-down-btn"
          @click.prevent
        >
          <icon-mdi-chevron-down />
        </button>
      </div>
      <button
        v-if="store.currentMember"
        w:rounded="md"
        w:text="base gray-300 hover:white"
        w:flex="~"
        w:h="min-content"
        w:align="items-center"
        class="btn-focus-ring"
        @click.prevent="editingPage = data!.infoPages![i]"
      >
        <icon-mdi-pencil />
      </button>
    </i18n-link>
    <button
      v-if="store.currentMember"
      w:rounded="md"
      w:text="sm gray-300 hover:white"
      w:display="flex"
      w:align="items-center"
      class="btn-focus-ring"
      @click.prevent="editingPage = {}"
    >
      <icon-mdi-plus />
      <span>Create new page</span>
    </button>
    <InfoPageDialog
      v-if="editingPage"
      :infoPage="editingPage"
      :isOpen="!!editingPage"
      :create="!editingPage.id"
      @update:isOpen="(isOpen) => !isOpen && (editingPage = null)"
    />
  </div>
</template>

<script setup lang="ts">
import {
  InfoPagesQueryDocument,
  InfoPagesQueryQuery,
} from '@app/graphql/dist/client';

const { locale } = useI18n();
const store = useStore();
const { fromUUID } = useShort();

const editingPage = ref<null | Partial<
  NonNullable<InfoPagesQueryQuery['infoPages']>[number]
>>(null);

const InfoPageDialog = useWaitImportComponent(
  computed(() => editingPage.value !== null),
  () => import('./InfoPageDialog.vue')
);

const { data } = await useQuery({
  query: InfoPagesQueryDocument,
});
const infoPages = computed(() =>
  (data.value?.infoPages || []).map((page) => useTranslation(page, locale))
);
</script>

<style>
.up-down-btn {
  @apply rounded-md text-base text-gray-300 items-center hover:text-white disabled:text-gray-800;
}
</style>
