<template>
  <FormDialog
    ref="formDialog"
    :is-open="isOpen"
    v-model:model="model"
    title="Create/update news"
    :form-props="{
      labelWidth: 140,
      rules,
      labelPlacement: 'top',
    }"
    @update:is-open="$emit('update:isOpen', false)"
    @open="onOpen"
    @close="onClose"
    :create-translation="createTranslation"
  >
    <template #create>
      <n-button type="primary" @click="handleSubmitClick">{{
        create ? 'Create' : 'Update'
      }}</n-button>
    </template>
    <template #default="{ root, index }">
      <n-form-item
        label="Title"
        ignore-path-change
        :path="`translations[${index}].title`"
        :rule="translationRules.title"
      >
        <n-input
          v-model:value="model.translations[index].title"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item
        label="Content"
        ignore-path-change
        :path="`translations[${index}].content`"
        :rule="translationRules.content"
      >
        <div w:w="full" class="content">
          <ContentEditor
            v-model="model.translations[index].content"
            :inline="false"
          />
        </div>
      </n-form-item>
    </template>
  </FormDialog>
</template>

<script setup lang="ts">
import {
  NewsesQueryQuery,
  TrLanguage,
  UpsertNewsDocument,
} from '@app/graphql/dist/client';
import { useClientHandle } from '@urql/vue';
import { FormInst, FormRules } from 'naive-ui';
import { PropType } from 'vue';

import FormDialog from './Form/FormDialog.vue';

const ContentEditor = defineAsyncComponent(
  () => import('./Form/ContentEditor.vue')
);

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  news: {
    type: Object as PropType<
      NonNullable<NewsesQueryQuery['newsesConnection']>['nodes'][number] | {}
    >,
    required: true,
  },
  create: { type: Boolean, required: true },
});
const emit = defineEmits(['update:isOpen']);

const { locale } = useI18n();
const handle = useClientHandle();
const formDialog = ref<
  (InstanceType<typeof FormDialog> & { form: FormInst }) | null
>(null);

async function handleSubmitClick(e: any) {
  e.preventDefault();
  formDialog.value!.form.validate(async (errors: any) => {
    if (errors) return;
    await handle.client
      .mutation(UpsertNewsDocument, {
        translations: model.value.translations,
        id: model.value.id,
      })
      .toPromise();
    emit('update:isOpen', false);
  });
}

const model = ref({
  id: undefined as undefined | number,
  translations: [] as {
    languageCode: TrLanguage;
    title: string;
    content: string;
  }[],
});

const translationRules = {
  title: {
    required: true,
    trigger: ['input', 'blur'],
    message: 'A title is required',
  },
  content: {
    required: true,
    trigger: ['input', 'blur'],
    message: 'Content is required',
  },
} as FormRules;

const rules = {
  translations: {
    required: true,
    validator() {
      if (model.value.translations.length < 1)
        return new Error('Must add at least one translation');

      return true;
    },
  },
} as FormRules;

function onOpen() {
  const news = props.news;
  if ('id' in news) {
    model.value.translations = (news.translations || []).map((trans) => ({
      languageCode: trans.languageCode,
      title: trans.title,
      content: trans.content,
    }));
    model.value.id = news.id;
  } else {
    onClose();
  }
}

function onClose() {
  model.value.translations = [];
  model.value.id = undefined;
}

function createTranslation() {
  return {
    title: '',
    content: '',
  };
}
</script>

<style scoped>
.credits {
  height: 100%;
}
.credits ::v-deep(.ck-editor) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.credits ::v-deep(.ck-editor__main) {
  flex-grow: 1;
}
.credits ::v-deep(.ck-editor__editable) {
  height: 100%;
}
</style>
