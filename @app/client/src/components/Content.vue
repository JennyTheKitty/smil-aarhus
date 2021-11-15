<template>
  <div>
    <div class="content">
      <div
        v-if="!editing"
        w:p="x-1"
        w:border="1 transparent"
        v-html="page?.content"
      ></div>
      <ContentEditor v-else v-model="editContent" />
    </div>
    <ClientOnly>
      <div v-if="state.currentMember && !editing" w:m="2">
        <button
          w:rounded="md"
          w:font="medium"
          w:space="x-2"
          w:text="sm gray-300 hover:white"
          w:p="y-2 x-3"
          w:display="flex"
          w:align="center"
          class="btn-focus-ring"
          @click="edit"
        >
          <span>
            {{ t('edit') }}
          </span>
          <icon-mdi-pencil />
        </button>
      </div>
      <div v-else-if="editing" w:flex="~" w:m="2" w:space="x-2">
        <button
          w:rounded="md"
          w:font="medium"
          w:space="x-2"
          w:text="sm gray-300 hover:white"
          w:p="y-2 x-3"
          w:display="flex"
          w:align="center"
          class="btn-focus-ring"
          @click="save"
        >
          <span>{{ t('cancel') }}</span>
        </button>
        <button
          w:rounded="md"
          w:font="medium"
          w:space="x-2"
          w:text="sm gray-300 hover:white"
          w:p="y-2 x-3"
          w:display="flex"
          w:align="center"
          w:bg="green-800"
          class="btn-focus-ring"
          @click="save"
        >
          <span>{{ t('save') }}</span>
          <icon-mdi-content-save />
        </button>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import {
  PageQueryDocument,
  TrLanguage,
  UpdatePageTranslationDocument,
} from '@app/graphql/dist/client';

import { useGlobalState } from '../store';
import { useTranslation } from '../utils';

const ContentEditor = defineAsyncComponent(() => import('./ContentEditor.vue'));

const props = defineProps<{
  name: string;
}>();

const { t, locale } = useI18n();
const state = useGlobalState();
const editing = ref(false);

const { data: pageData } = useQuery({
  query: PageQueryDocument,
  variables: computed(() => ({ name: props.name })),
});
const page = computed(() => useTranslation(pageData.value?.page, locale));

const editContent = ref('');

const { executeMutation: updatePageTranslation } = useMutation(
  UpdatePageTranslationDocument
);

function edit() {
  editing.value = true;
  editContent.value = page.value?.content || '';
}
async function save() {
  await updatePageTranslation({
    content: editContent.value,
    pageName: props.name,
    languageCode: locale.value.toUpperCase() as TrLanguage,
  });
  editing.value = false;
}
</script>
