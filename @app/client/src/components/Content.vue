<template>
  <div>
    <div class="content" w:text="base">
      <div
        v-if="!editing"
        w:p="x-1"
        w:border="1 transparent"
        v-html="page?.content"
      ></div>
      <ContentEditor v-else v-model="editContent" :inline="true" />
    </div>
    <ClientOnly>
      <div v-if="store.currentMember" w:m="2">
        <EditButton
          v-model:editing="editing"
          :save="true"
          @save="save"
          @cancel="cancel"
        />
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

import { useStore } from '../store';
import { useTranslation } from '../utils';

const editing = ref(false);

const ContentEditor = useWaitImportComponent(
  editing,
  () => import('./ContentEditor.vue')
);

const props = defineProps<{
  name: string;
}>();

const { t, locale } = useI18n();
const store = useStore();

const { data: pageData } = await useQuery({
  query: PageQueryDocument,
  variables: computed(() => ({ name: props.name })),
});
const page = computed(() => useTranslation(pageData.value?.page, locale));

const editContent = ref('');

const { executeMutation: updatePageTranslation } = useMutation(
  UpdatePageTranslationDocument
);

watch(editing, (editing) => {
  if (editing) {
    editContent.value = page.value?.content || '';
  }
});

async function save() {
  await updatePageTranslation({
    content: editContent.value,
    pageName: props.name,
    languageCode: locale.value.toUpperCase() as TrLanguage,
  });
  editing.value = false;
}

function cancel() {
  editing.value = false;
}
</script>
