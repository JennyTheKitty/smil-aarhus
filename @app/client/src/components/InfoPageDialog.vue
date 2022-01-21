<template>
  <FormDialog
    ref="formDialog"
    :is-open="isOpen"
    :model="model"
    title="Create/update info page"
    :form-props="{
      labelWidth: 140,
      rules,
      labelPlacement: 'left',
    }"
    @update:is-open="$emit('update:isOpen', false)"
    @open="onOpen"
    @close="onClose"
  >
    <template #create>
      <n-button type="primary" @click="handleSubmitClick">{{
        create ? 'Create' : 'Update'
      }}</n-button>
    </template>
    <template #default="{ root }">
      <n-form-item label="Name" path="name">
        <n-input
          v-model:value="model.name"
          @keydown.enter.prevent
          :disabled="!create"
        />
      </n-form-item>
      <n-form-item label="Icon" path="icon">
        <n-input v-model:value="model.icon" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item
        path="translations"
        :show-feedback="false"
        :show-label="false"
      >
        <TranslationInput
          v-model:value="model.translations"
          :to="root!"
          :on-create="createTranslation"
          #="{ index }"
        >
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
            label="Subtitle"
            ignore-path-change
            :path="`translations[${index}].subtitle`"
            :rule="translationRules.subtitle"
          >
            <n-input
              v-model:value="model.translations[index].subtitle"
              @keydown.enter.prevent
            />
          </n-form-item>
        </TranslationInput>
      </n-form-item>
    </template>
  </FormDialog>
</template>

<script setup lang="ts">
import {
  InfoPagesQueryQuery,
  TrLanguage,
  UpsertInfoPageDocument,
} from '@app/graphql/dist/client';
import { useClientHandle } from '@urql/vue';
import { FormInst, FormRules, NButton, NFormItem, NInput } from 'naive-ui/lib';
import { PropType } from 'vue';

import FormDialog from './FormDialog.vue';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  infoPage: {
    type: Object as PropType<
      Partial<NonNullable<InfoPagesQueryQuery['infoPages']>['nodes'][number]>
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
      .mutation(UpsertInfoPageDocument, {
        data: {
          icon: model.icon,
        },
        translations: model.translations,
        name: model.name,
      })
      .toPromise();
    emit('update:isOpen', false);
  });
}

const model = reactive({
  icon: '',
  name: '',
  translations: [] as {
    languageCode: TrLanguage;
    title: string;
    subtitle: string;
  }[],
});

const translationRules = {
  title: {
    required: true,
    trigger: ['input', 'blur'],
    message: 'A title is required',
  },
  subtitle: {
    required: true,
    trigger: ['input', 'blur'],
    message: 'A subtitle is required',
  },
} as FormRules;

const rules = {
  icon: {
    required: true,
    trigger: ['input', 'blur'],
    message: 'An icon is required',
  },
  translations: {
    required: true,
    validator() {
      if (model.translations.length < 1)
        return new Error('Must add at least one translation');

      return true;
    },
  },
} as FormRules;

function onOpen() {
  const infoPage = props.infoPage;
  model.icon = infoPage.icon || '';
  model.translations = (infoPage.translations?.nodes || []).map((trans) => ({
    languageCode: trans.languageCode,
    title: trans.title,
    subtitle: trans.subtitle,
  }));
  model.name = infoPage.name || '';
}

function onClose() {
  model.icon = '';
  model.name = '';
  model.translations = [];
}

function createTranslation() {
  return {
    languageCode: '',
    title: '',
    subtitle: '',
  };
}
</script>
