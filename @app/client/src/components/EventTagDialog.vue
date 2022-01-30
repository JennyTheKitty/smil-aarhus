<template>
  <FormDialog
    ref="formDialog"
    :is-open="isOpen"
    v-model:model="model"
    title="Create/update event category"
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
      <div w:grid="~ cols-2  gap-4">
        <n-form-item label="Category image" path="image" label-placement="top">
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
      <n-form-item label="Event color" path="color" label-placement="top">
        <n-color-picker
          :to="root!"
          :showPreview="true"
          v-model:value="model.color"
        />
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
    </template>
  </FormDialog>
</template>

<script setup lang="ts">
import {
  EventTagsQueryQuery,
  TrLanguage,
  UpsertEventTagDocument,
} from '@app/graphql/dist/client';
import { useClientHandle } from '@urql/vue';
import { FormInst, FormRules } from 'naive-ui';
import { PropType } from 'vue';

import FormDialog from './Form/FormDialog.vue';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  tag: {
    type: Object as PropType<
      | NonNullable<
          NonNullable<
            EventTagsQueryQuery['eventTagsConnection']
          >['nodes'][number]
        >
      | {}
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
      .mutation(UpsertEventTagDocument, {
        data: {
          image: model.value.image,
          imageCredit: model.value.imageCredit,
          color: model.value.color,
        },
        translations: model.value.translations,
        id: model.value.id,
      })
      .toPromise();
    emit('update:isOpen', false);
  });
}

const model = ref({
  image: null as string | null,
  id: undefined as undefined | number,
  color: undefined as undefined | string,
  imageCredit: '',
  translations: [] as {
    languageCode: TrLanguage;
    title: string;
  }[],
});

const translationRules = {
  title: {
    required: true,
    trigger: ['input', 'blur'],
    message: 'A title is required',
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
  const tag = props.tag;
  if ('id' in tag) {
    model.value.image = tag.image;
    model.value.translations = (tag.translations || []).map((trans) => ({
      languageCode: trans.languageCode,
      title: trans.title,
    }));
    model.value.color = tag.color || undefined;
    model.value.id = tag.id;
  } else {
    onClose();
  }
}

function onClose() {
  model.value.image = null;
  model.value.color = undefined;
  model.value.translations = [];
  model.value.id = undefined;
}

function createTranslation() {
  return {
    title: '',
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
