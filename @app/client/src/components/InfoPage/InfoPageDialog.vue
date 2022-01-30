<template>
  <FormDialog
    ref="formDialog"
    :is-open="isOpen"
    v-model:model="model"
    title="Create/update info page"
    :form-props="{
      labelWidth: 140,
      rules,
      labelPlacement: 'left',
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
      <n-form-item label="Icon" path="icon">
        <n-input v-model:value="model.icon" @keydown.enter.prevent />
      </n-form-item>
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
import { FormInst, FormRules } from 'naive-ui';
import { PropType } from 'vue';

import FormDialog from '../Form/FormDialog.vue';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  infoPage: {
    type: Object as PropType<
      Partial<NonNullable<InfoPagesQueryQuery['infoPages']>[number]>
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
          icon: model.value.icon,
        },
        translations: model.value.translations,
        id: model.value.id,
      })
      .toPromise();
    emit('update:isOpen', false);
  });
}

const model = ref({
  icon: '',
  id: undefined as undefined | string,
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
      if (model.value.translations.length < 1)
        return new Error('Must add at least one translation');

      return true;
    },
  },
} as FormRules;

function onOpen() {
  const infoPage = props.infoPage;
  if ('id' in infoPage) {
    model.value.icon = infoPage.icon || '';
    model.value.translations = (infoPage.translations || []).map((trans) => ({
      languageCode: trans.languageCode,
      title: trans.title,
      subtitle: trans.subtitle,
    }));
    model.value.id = infoPage.id;
  } else {
    onClose();
  }
}

function onClose() {
  model.value.icon = '';
  model.value.id = undefined;
  model.value.translations = [];
}

function createTranslation() {
  return {
    languageCode: '',
    title: '',
    subtitle: '',
  };
}
</script>
