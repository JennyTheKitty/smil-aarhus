<template>
  <FormDialog
    ref="formDialog"
    :is-open="isOpen"
    :model="model"
    title="Create/update event"
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
      <n-button w:m="r-5" @click="onSaveAsTemplate">
        <icon-carbon-template w:m="r-2" />
        Save as new template
      </n-button>
      <n-button type="primary" @click="handleSubmitClick">{{
        create ? 'Create' : 'Update'
      }}</n-button>
    </template>
    <template #default="{ root }">
      <div v-if="create">
        <EventDialogTemplateSelect :to="root!" @select="onTemplateSelected" />
        <span w:text="center" w:w="full" w:display="block" w:m="b-5">
          ...or create from scratch:
        </span>
      </div>
      <n-form-item label="Date/time" path="date">
        <n-date-picker
          v-model:value="date"
          w:w="full"
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
          :get="EventTagByIdDocument"
          :search="SearchEventTagsDocument"
        />
      </n-form-item>
      <n-form-item label="Groups">
        <SearchSelect
          v-model:value="model.groups"
          :to="root!"
          :get="GroupByIdDocument"
          :search="SearchGroupsDocument"
        />
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
        </TranslationInput>
      </n-form-item>
    </template>
  </FormDialog>
</template>

<script setup lang="ts">
import {
  CalendarEventBySlugQuery,
  DetailedEventFragment,
  Event,
  EventTagByIdDocument,
  GroupByIdDocument,
  SearchEventTagsDocument,
  SearchGroupsDocument,
  TrLanguage,
  UpsertEventDocument,
} from '@app/graphql/dist/client';
import { useClientHandle } from '@urql/vue';
import dayjs from 'dayjs';
import {
  FormRules,
  NButton,
  NDatePicker,
  NFormItem,
  NInput,
} from 'naive-ui/lib';

import { useTranslation } from '../../utils';

const ContentEditor = defineAsyncComponent(
  () => import('../ContentEditor.vue')
);

const props = defineProps<{
  create: boolean;
  isOpen: boolean;
  event:
    | Pick<Event, 'startsAt' | 'endsAt'>
    | NonNullable<CalendarEventBySlugQuery['eventBySlug']>;
  allDay: boolean;
  refresh: () => void;
}>();
const emit = defineEmits(['update:isOpen']);

const { locale } = useI18n();
const formDialog = ref<HTMLFormElement | null>(null);
const handle = useClientHandle();

const form = computed(() => formDialog.value!.form);

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
} as FormRules;

function replaceTime(
  date: { startsAt: Date; endsAt: Date },
  time: { startsAt: Date; endsAt: Date }
): { startsAt: Date; endsAt: Date } {
  const timeStartsAt = dayjs(time.startsAt);
  const timeDiff = dayjs(time.endsAt).diff(dayjs(time.startsAt));
  const startsAt = dayjs(date.startsAt)
    .startOf('day')
    .hour(timeStartsAt.hour())
    .minute(timeStartsAt.minute())
    .second(timeStartsAt.second())
    .millisecond(timeStartsAt.millisecond());

  const endsAt = startsAt.add(timeDiff, 'ms');

  return { startsAt: startsAt.toDate(), endsAt: endsAt.toDate() };
}

function modelFromEvent(
  event:
    | Pick<Event, 'startsAt' | 'endsAt'>
    | NonNullable<CalendarEventBySlugQuery['eventBySlug']>,
  template = false
) {
  if (template) {
    if (props.allDay) {
      const newTimes = replaceTime(
        { startsAt: model.startsAt!, endsAt: model.endsAt! },
        { startsAt: new Date(event.startsAt), endsAt: new Date(event.endsAt) }
      );
      model.startsAt = newTimes.startsAt;
      model.endsAt = newTimes.endsAt;
    }
  } else {
    model.startsAt = event.startsAt ? new Date(event.startsAt) : null;
    model.endsAt = event.endsAt ? new Date(event.endsAt) : null;
  }
  model.tags = (('tags' in event && event.tags) || []).map((t) => {
    const tag = useTranslation(t.tag, locale)!;
    return tag.id;
  });
  model.groups = (('groups' in event && event.groups) || []).map((g) => {
    const group = useTranslation(g.group, locale)!;
    return group.id;
  });
  model.translations = (
    ('translations' in event && event.translations) ||
    []
  ).map((trans) => ({
    languageCode: trans.languageCode,
    title: trans.title,
    description: trans.description,
  }));
  model.id = 'id' in event ? event.id : null;
}

function onOpen() {
  modelFromEvent(props.event);
}

function onClose() {
  model.endsAt = null;
  model.startsAt = null;
  model.tags = [];
  model.groups = [];
  model.translations = [];
}

async function handleSubmitClick(e: any) {
  e.preventDefault();
  form.value.validate(async (errors: any) => {
    if (errors) return;
    await handle.client
      .mutation(UpsertEventDocument, {
        data: {
          startsAt: model.startsAt!.toISOString(),
          endsAt: model.endsAt!.toISOString(),
          templateName: null,
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

function onTemplateSelected(event: DetailedEventFragment) {
  modelFromEvent(event, true);
}

async function onSaveAsTemplate(e: any) {
  const templateName = window.prompt('Template name:');
  e.preventDefault();
  form.value.validate(async (errors: any) => {
    if (errors) return;
    await handle.client
      .mutation(UpsertEventDocument, {
        data: {
          startsAt: model.startsAt!.toISOString(),
          endsAt: model.endsAt!.toISOString(),
          templateName: templateName,
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
</script>
