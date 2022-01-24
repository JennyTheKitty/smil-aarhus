<template>
  <FormDialog
    ref="formDialog"
    :is-open="isOpen"
    :model="model"
    title="Create/update group"
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
      <n-form-item label="Type of group" path="isOpen" label-placement="top">
        <n-radio-group
          :value="model.isOpen ? 'true' : 'false'"
          @update-value="(val) => (model.isOpen = val === 'true')"
        >
          <n-radio-button value="true">Open group</n-radio-button>
          <n-radio-button value="false">Closed group</n-radio-button>
        </n-radio-group>
      </n-form-item>
      <div w:grid="~ cols-2  gap-4">
        <n-form-item label="Group image" path="image" label-placement="top">
          <ImageUpload v-model:value="model.image" />
        </n-form-item>
        <n-form-item
          label="Image credits"
          path="imageCredit"
          label-placement="top"
        >
          <div w:w="full" class="content credits">
            <ContentEditor v-model="model.imageCredit" :inline="false" />
          </div>
        </n-form-item>
      </div>
      <!-- <TranslationInput
        v-model:value="model.translations"
        :to="root!"
        :on-create="createTranslation"
        #="{ index }"
      > -->
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
        label="Activity"
        ignore-path-change
        :path="`translations[${index}].activity`"
        :rule="translationRules.activity"
      >
        <n-input
          v-model:value="model.translations[index].activity"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item
        label="Full description"
        ignore-path-change
        :path="`translations[${index}].description`"
        :rule="translationRules.description"
      >
        <div w:w="full" class="content">
          <ContentEditor
            v-model="model.translations[index].description"
            :inline="false"
          />
        </div>
      </n-form-item>
      <n-form-item
        label="Short description"
        ignore-path-change
        :path="`translations[${index}].shortDescription`"
        :rule="translationRules.shortDescription"
      >
        <n-input
          v-model:value="model.translations[index].shortDescription"
          type="textarea"
          @keydown.enter.prevent
        />
      </n-form-item>
      <!-- </TranslationInput> -->
    </template>
  </FormDialog>
</template>

<script setup lang="ts">
import {
  GroupQueryQuery,
  TrLanguage,
  UpsertGroupDocument,
} from '@app/graphql/dist/client';
import { useClientHandle } from '@urql/vue';
import {
  FormInst,
  FormRules,
  NButton,
  NFormItem,
  NInput,
  NRadioButton,
  NRadioGroup,
} from 'naive-ui/lib';
import { PropType } from 'vue';

import FormDialog from './FormDialog.vue';

const ContentEditor = defineAsyncComponent(() => import('./ContentEditor.vue'));

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  group: {
    type: Object as PropType<NonNullable<GroupQueryQuery['groupBySlug']>>,
    required: true,
  },
});
const emit = defineEmits(['update:isOpen']);

const { locale } = useI18n();
const handle = useClientHandle();
const formDialog = ref<
  (InstanceType<typeof FormDialog> & { form: FormInst }) | null
>(null);

const create = false;

async function handleSubmitClick(e: any) {
  e.preventDefault();
  formDialog.value!.form.validate(async (errors: any) => {
    if (errors) return;
    await handle.client
      .mutation(UpsertGroupDocument, {
        data: {
          image: model.image,
          imageCredit: model.imageCredit,
          isOpen: model.isOpen!,
        },
        translations: model.translations,
        id: model.id,
      })
      .toPromise();
    emit('update:isOpen', false);
  });
}

const model = reactive({
  image: undefined as string | undefined,
  imageCredit: '',
  isOpen: undefined as undefined | boolean,
  id: null as null | number,
  translations: [] as {
    languageCode: TrLanguage;
    title: string;
    shortDescription: string;
    description: string;
    activity: string;
  }[],
});

const translationRules = {
  title: {
    required: true,
    trigger: ['input', 'blur'],
    message: 'A title is required',
  },
  shortDescription: {
    required: true,
    trigger: ['input', 'blur'],
    message: 'A short description is required',
  },
  activity: {
    required: true,
    trigger: ['input', 'blur'],
    message: 'Activity is required.',
  },
  description: {
    required: true,
    trigger: ['input', 'blur'],
    message: 'A description is required',
  },
} as FormRules;

const rules = {
  isOpen: {
    required: true,
  },
  image: {
    required: true,
    trigger: ['input', 'blur'],
    message: 'An image is required',
  },
  imageCredit: {
    required: true,
    trigger: ['input', 'blur'],
    message: 'Image credits are required',
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
  const group = props.group;
  model.image = group.image;
  model.isOpen = group.isOpen;
  model.translations = (group.translations || []).map((trans) => ({
    languageCode: trans.languageCode,
    title: trans.title,
    shortDescription: trans.shortDescription,
    description: trans.description,
    activity: trans.activity,
  }));
  model.id = group.id;
}

function onClose() {
  model.image = undefined;
  model.isOpen = undefined;
  model.translations = [];
}

function createTranslation() {
  return {
    title: '',
    description: '',
    activity: '',
    shortDescription: '',
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
