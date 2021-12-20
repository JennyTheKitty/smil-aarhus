<template>
  <BaseDialog :is-open="isOpen" @update:is-open="() => cancelButton!.check()">
    <div ref="root">
      <div
        w:w="xl"
        w:shadow="lg"
        w:pos="relative"
        w:border="2 pink-800 rounded-lg"
        w:bg="dark-800"
        w:text="white"
        w:p="4"
        w:max-h="90vh"
        w:overflow="scroll"
      >
        <DialogTitle class="sr-only">Create/update event</DialogTitle>
        <n-config-provider :theme="darkTheme">
          <div v-if="create">
            <n-popover
              trigger="click"
              placement="bottom"
              :to="root!"
              width="trigger"
              overlap
              @update-show="focusTemplateSelect"
            >
              <template #trigger>
                <n-button w:m="b-2" w:w="full" w:p="y-4" size="large" dashed>
                  <icon-carbon-template w:m="r-2" />
                  Create from template
                </n-button>
              </template>
              <SearchSelect
                ref="templateSelect"
                v-model:value="model.tags"
                :to="root!"
                autofocus
                placeholder="Select template"
                type="eventTag"
              />
            </n-popover>
            <span w:text="center" w:w="full" w:display="block" w:m="b-5">
              ...or create from scratch:
            </span>
          </div>
          <n-form
            ref="form"
            :label-width="80"
            :model="model"
            label-placement="left"
            :rules="rules"
          >
            <n-form-item label="Date/time" path="date">
              <n-date-picker
                v-model:value="date"
                type="datetimerange"
                clearable
                :update-value-on-close="true"
                :actions="[]"
                :to="root!"
              />
            </n-form-item>
            <n-form-item label="Categories">
              <SearchSelect
                v-model:value="model.tags"
                :to="root!"
                type="eventTag"
              />
            </n-form-item>
            <n-form-item label="Groups">
              <SearchSelect
                v-model:value="model.groups"
                :to="root!"
                type="group"
              />
            </n-form-item>
            <span w:text="lg center" w:w="full" w:display="block" w:m="t-2 b-4">
              Translations
            </span>
            <n-form-item path="translations">
              <n-dynamic-input
                v-model:value="model.translations"
                :on-create="createTranslation"
                class="translations"
                #="{ index, value }"
              >
                <n-form-item
                  label="Language"
                  ignore-path-change
                  :path="`translations[${index}].languageCode`"
                  :rule="translationRules.languageCode"
                >
                  <n-select
                    v-model:value="model.translations[index].languageCode"
                    :options="languageOptions"
                    :to="root!"
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
                <n-form-item
                  label="Description"
                  ignore-path-change
                  :path="`translations[${index}].description`"
                >
                  <div w:w="full">
                    <ContentEditor
                      v-model="model.translations[index].description"
                      :inline="false"
                    />
                  </div>
                </n-form-item>
              </n-dynamic-input>
            </n-form-item>
            <n-form-item w:m="t-6" :show-feedback="false">
              <input type="submit" w:display="hidden" />
              <DirtyCancelButton
                ref="cancelButton"
                :dirty="dirty"
                @confirm="$emit('update:isOpen', false)"
              />
              <div w:flex="grow"></div>
              <n-button w:m="r-5" @click="1">
                <icon-carbon-template w:m="r-2" />
                Save as new template
              </n-button>
              <n-button type="primary" @click="handleSubmitClick">{{
                create ? 'Create' : 'Update'
              }}</n-button>
            </n-form-item>
          </n-form>
        </n-config-provider>
      </div>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import {
  Event,
  TrLanguage,
  UpsertEventDocument,
} from '@app/graphql/dist/client';
import { useClientHandle } from '@urql/vue';
import {
  darkTheme,
  FormRules,
  NButton,
  NConfigProvider,
  NDatePicker,
  NDynamicInput,
  NForm,
  NFormItem,
  NInput,
  NPopover,
  NSelect,
} from 'naive-ui';

import { useTranslation } from '../../utils';
import BaseDialog from '../BaseDialog.vue';
import DirtyCancelButton from '../Form/DirtyCancelButton.vue';

const ContentEditor = defineAsyncComponent(
  () => import('../ContentEditor.vue')
);

const props = defineProps<{
  create: boolean;
  isOpen: boolean;
  event: Partial<Event>;
  refresh: () => void;
}>();
const emit = defineEmits(['update:isOpen']);

const { locale } = useI18n();
const root = ref<HTMLDivElement | null>(null);
const dirty = ref(false);
let dirtyWatchStop: () => void = () => {};
const cancelButton = ref<typeof DirtyCancelButton | null>(null);
const templateSelect = ref<typeof NSelect | null>(null);
const form = ref<HTMLFormElement | null>(null);
const handle = useClientHandle();

const model = reactive({
  id: null as number | null,
  startsAt: null as Date | null,
  endsAt: null as Date | null,
  tags: [] as number[],
  groups: [] as number[],
  translations: [] as {
    languageCode: TrLanguage;
    title: string;
    description: string;
  }[],
});

const translationRules = {
  languageCode: {
    required: true,
    trigger: ['input', 'blur'],
    message: 'Language is required',
  },
  title: {
    required: true,
    trigger: ['input', 'blur'],
    message: 'Title is required',
  },
} as FormRules;

const rules = {
  date: {
    required: true,
    trigger: ['input', 'blur'],
    validator() {
      if (!model.startsAt || !model.endsAt)
        return new Error('Date/time is required.');
      if (model.startsAt.valueOf() + 60 * 1000 > model.endsAt.valueOf())
        return new Error('Event must last at least 1 minute.');
      return true;
    },
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

function fromEvent(event: Partial<Event>) {
  model.startsAt = event.startsAt ? new Date(event.startsAt) : null;
  model.endsAt = event.endsAt ? new Date(event.endsAt) : null;
  model.tags = (event.tags?.nodes || []).map((t) => {
    const tag = useTranslation(t.tag, locale)!;
    return tag.id;
  });
  model.groups = (event.groups?.nodes || []).map((g) => {
    const group = useTranslation(g.group, locale)!;
    return group.id;
  });
  model.translations = (event.translations?.nodes || []).map((trans) => ({
    languageCode: trans.languageCode,
    title: trans.title,
    description: trans.description,
  }));
  model.id = event.id;
}

const languageOptions = computed(() => {
  const langs = [
    { label: 'Dansk', value: 'DA' as TrLanguage },
    { label: 'English', value: 'EN' as TrLanguage },
  ];
  return langs.filter(
    (lang) =>
      !model.translations.some((trans) => trans.languageCode == lang.value)
  );
});

watch(
  () => props.isOpen,
  async (isOpen) => {
    dirtyWatchStop();
    if (isOpen) {
      fromEvent(props.event);
      dirty.value = false;
      dirtyWatchStop = watch(
        model,
        () => {
          dirtyWatchStop();
          dirty.value = true;
        },
        { deep: true }
      );
    } else {
      model.endsAt = null;
      model.startsAt = null;
      model.tags = [];
      model.groups = [];
      model.translations = [];
    }
  },
  { immediate: true }
);

async function handleSubmitClick(e: any) {
  e.preventDefault();
  form.value!.validate(async (errors: any) => {
    if (errors) return;
    await handle.client
      .mutation(UpsertEventDocument, {
        data: {
          startsAt: model.startsAt!.toISOString(),
          endsAt: model.endsAt!.toISOString(),
          isTemplate: false,
          special: false,
          groupIds: model.groups,
          tagIds: model.tags,
        },
        translations: model.translations,
        id: model.id,
      })
      .toPromise();
    props.refresh();
    emit('update:isOpen', false);
  });
}

function createTranslation() {
  return { languageCode: '', title: '', description: '' };
}

const date = computed({
  get: () =>
    model.startsAt && model.endsAt
      ? ([model.startsAt.valueOf(), model.endsAt.valueOf()] as [number, number])
      : null,
  set: (date) => {
    model.startsAt = date && date[0] ? new Date(date[0]) : null;
    model.endsAt = date && date[1] ? new Date(date[1]) : null;
  },
});

// TODO: Implement templates
async function focusTemplateSelect(show: boolean) {
  if (!show) return;
  await until(templateSelect).not.toBeNull();
  templateSelect.value!.$el.querySelector('.n-base-selection').click();
}
</script>

<style scoped>
.translations :deep(.n-dynamic-input-item) {
  flex-direction: column;
}
.translations :deep(.n-dynamic-input-item__action) {
  align-self: center;
}
</style>
