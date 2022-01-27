<template>
  <BaseDialog :is-open="isOpen" @update:is-open="() => cancelButton!.check()">
    <div
      ref="root"
      w:p="x-2 t-2"
      w:border="2 pink-800 rounded-lg"
      w:w="5xl"
      w:shadow="lg"
      w:pos="relative"
      w:bg="dark-800"
      w:text="white"
      w:max-h="90vh"
      w:h="90vh"
    >
      <NaiveWrapper w:h="full">
        <n-form
          ref="form"
          :model="model"
          v-bind="formProps"
          w:flex="~ col"
          w:h="full"
        >
          <input type="submit" w:display="hidden" />
          <div w:border="b-2 pink-800" w:p="2">
            <div class="header-grid">
              <div w:justify="self-start center" w:flex="~ col">
                <DirtyCancelButton
                  ref="cancelButton"
                  :dirty="dirty"
                  :to="root!"
                  @confirm="$emit('update:isOpen', false)"
                />
              </div>
              <div
                w:justify="self-center"
                w:flex="~ col"
                w:align="items-center"
              >
                <DialogTitle w:text="lg" w:font="bold">{{ title }}</DialogTitle>
                <div w:flex="~" w:justify="center" w:m="t-2">
                  <button
                    v-for="option in LANGUAGE_OPTIONS"
                    :value="option.value"
                    w:flex="grow"
                    w:border="1 hover:pink-900"
                    w:p="2"
                    w:w="40"
                    w:outline=""
                    @click="switchLanguage(option.value)"
                    :class="{
                      'bg-pink-900': currentLanguageCode === option.value,
                      'border-gray-500': currentLanguageCode !== option.value,
                      'border-pink-900': currentLanguageCode === option.value,
                      'ring-2 ring-red-500': languageHasErrors.includes(
                        option.value
                      ),
                    }"
                  >
                    {{ option.label }}
                    <span
                      w:text="sm"
                      w:font="light"
                      v-if="languageIsEmpty(option.value)"
                      >(empty)</span
                    >
                  </button>
                </div>
              </div>
              <div w:justify="self-end center" w:flex="~ col" w:space-y="2">
                <slot name="create"></slot>
              </div>
            </div>
          </div>
          <div w:flex="grow" w:overflow="hidden">
            <div w:p="x-4 t-4" w:overflow="y-auto" w:h="full">
              <slot
                v-if="currentLanguageIndex !== -1"
                :root="root"
                :index="currentLanguageIndex"
              ></slot>
            </div>
          </div>
        </n-form>
      </NaiveWrapper>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import {
  darkTheme,
  FormInst,
  FormProps,
  NConfigProvider,
  NForm,
  FormItemInst,
} from 'naive-ui/lib';
import { formItemInstsInjectionKey } from 'naive-ui/lib/form/src/interface';
import { PropType } from 'vue';
import { TrLanguage } from '@app/graphql/dist/client';

import DirtyCancelButton from './DirtyCancelButton.vue';
import NaiveWrapper from '../../NaiveWrapper.vue';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, required: true },
  model: {
    type: Object as PropType<
      Record<string, any> & {
        translations: (Record<string, any> & { languageCode: TrLanguage })[];
      }
    >,
    required: true,
  },
  formProps: {
    type: Object as PropType<FormProps>,
    default: () => {},
  },
  createTranslation: { type: Function as PropType<() => any>, required: true },
});
const model = toRef(props, 'model');
const emit = defineEmits(['update:isOpen', 'open', 'close', 'update:model']);

const root = ref<HTMLDivElement | null>(null);
const dirty = ref(false);
let dirtyWatchStop: () => void = () => {};
const cancelButton = ref<typeof DirtyCancelButton | null>(null);
const form = ref<FormInst | null>(null);
const { locale } = useI18n();

const LANGUAGE_OPTIONS = [
  { label: 'Dansk', value: 'DA' as TrLanguage },
  { label: 'English', value: 'EN' as TrLanguage },
];

const currentLanguageCode = ref<TrLanguage>(
  (
    model.value.translations.find(
      (t) => t.languageCode === locale.value.toUpperCase()
    ) || { languageCode: locale.value.toUpperCase() as TrLanguage }
  ).languageCode
);
const languageHasErrors = ref<TrLanguage[]>([]);
const languageIsEmpty = (lang: TrLanguage) =>
  Object.entries(
    model.value.translations.find((t) => t.languageCode === lang) || {}
  ).every(([key, val]) => {
    if (key === 'languageCode') return true;
    if (val === '') return true;
  });
const currentLanguageIndex = computed<number>(() =>
  model.value.translations.findIndex(
    (t) => t.languageCode == currentLanguageCode.value
  )
);

provide(key.formDialogCurrentLanguageCode, currentLanguageCode);

watch(
  () => props.isOpen,
  async (isOpen) => {
    console.log(isOpen);
    dirtyWatchStop();
    if (isOpen) {
      emit('open');
      await nextTick();
      maybeAddTranslation();
      await nextTick();
      currentLanguageCode.value = (
        model.value.translations.find(
          (t) => t.languageCode === locale.value.toUpperCase()
        ) || { languageCode: locale.value.toUpperCase() as TrLanguage }
      ).languageCode;
      dirty.value = false;
      dirtyWatchStop = watch(
        toRef(props, 'model'),
        () => {
          dirtyWatchStop();
          dirty.value = true;
        },
        { deep: true }
      );
    } else {
      emit('close');
      languageHasErrors.value = [];
    }
  },
  { immediate: true }
);

function switchLanguage(newLanguage: TrLanguage) {
  const oldLanguage = currentLanguageCode.value;

  currentLanguageCode.value = newLanguage;
  maybeAddTranslation();

  if (!languageIsEmpty(oldLanguage)) validateLanguage(oldLanguage);
  if (!languageIsEmpty(currentLanguageCode.value))
    validateLanguage(currentLanguageCode.value);
}

function validateLanguage(lang: TrLanguage) {
  languageHasErrors.value = languageHasErrors.value.filter((v) => v !== lang);

  const index = model.value.translations.findIndex(
    (t) => t.languageCode === lang
  );

  const formItemInsts: { formItems: Record<string, FormItemInst[]> } =
    // @ts-ignore
    form.value.$.provides[formItemInstsInjectionKey];

  const shouldRuleBeApplied = () => true;
  const formItemValidationPromises = Object.entries(formItemInsts.formItems)
    .filter(
      ([path, insts]) => path && path.startsWith(`translations[${index}]`)
    )
    .flatMap(([path, insts]: [string, FormItemInst[]]) => {
      return insts.map((inst) =>
        inst.internalValidate('blur', shouldRuleBeApplied)
      );
    });
  void Promise.all(formItemValidationPromises).then((results) => {
    if (results.some((result) => !result.valid)) {
      languageHasErrors.value.push(lang);
    }
  });
}

function maybeAddTranslation() {
  console.log(
    currentLanguageCode.value,
    model.value.translations,
    currentLanguageIndex.value
  );
  if (currentLanguageIndex.value === -1) {
    console.log({
      ...model.value,
      translations: [
        ...model.value.translations,
        {
          ...props.createTranslation(),
          languageCode: currentLanguageCode.value,
        },
      ],
    });
    emit('update:model', {
      ...model.value,
      translations: [
        ...model.value.translations,
        {
          ...props.createTranslation(),
          languageCode: currentLanguageCode.value,
        },
      ],
    });
  }
}

defineExpose({ form });
</script>

<style scoped>
.header-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
}
</style>
