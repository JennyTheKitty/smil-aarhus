<template>
  <n-tabs
    v-model:value="currentTab"
    class="tabs"
    type="card"
    :addable="addable"
    :closable="closable"
    @close="closeTab"
    @add="addTab"
    @before-leave="beforeLeaveTab"
  >
    <n-tab-pane
      v-for="tab in tabs"
      :key="tab"
      :name="tab"
      display-directive="show"
      :style="{
        ...(tabHasErrors[tab]
          ? { '--tab-border-color': 'var(--feedback-text-color-error)' }
          : {}),
        '--pane-padding': '12px',
      }"
    >
      <template #tab>
        {{ LANGUAGE_OPTIONS.find((o) => o.value == tabLanguages[tab])?.label }}
      </template>
      <n-form-item
        label="Language"
        ignore-path-change
        path="translations"
        required
      >
        <n-select
          v-model:value="tabLanguages[tab]"
          :rule="languageRule"
          :options="[
            ...filteredLanguageOptions,
            LANGUAGE_OPTIONS.find((o) => tabLanguages[tab] === o.value)!,
          ]"
          :to="to"
        />
      </n-form-item>
      <div v-if="value[tab]"><slot :index="tab"></slot></div>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { TrLanguage } from '@app/graphql/dist/client';
import { NFormItem, NSelect, NTabPane, NTabs } from 'naive-ui/lib';
import {
  FormItemInst,
  formItemInstsInjectionKey,
} from 'naive-ui/lib/form/src/interface';
import { PropType } from 'vue';

const { locale } = useI18n();

const props = defineProps({
  to: {
    type: [String, Object, Boolean] as PropType<string | boolean | HTMLElement>,
    default: undefined,
  },
  value: { type: Array as PropType<any[]>, required: true },
  onCreate: { type: Function as PropType<() => any>, required: true },
});
const emit = defineEmits(['update:value']);

const LANGUAGE_OPTIONS = [
  { label: 'Dansk', value: 'DA' as TrLanguage },
  { label: 'English', value: 'EN' as TrLanguage },
];

const currentTab = ref(0);
const tabs = ref<number[]>([]);
const tabLanguages = ref<{
  [tab: number]: typeof LANGUAGE_OPTIONS[number]['value'];
}>({});
const tabHasErrors = ref<{
  [tab: number]: boolean;
}>({});
const addable = computed(() => tabs.value.length < LANGUAGE_OPTIONS.length);
const closable = computed(() => tabs.value.length > 1);

const languageRule = {
  required: true,
  trigger: ['input', 'blur'],
  message: 'Language is required',
};

const filteredLanguageOptions = computed(() => {
  return LANGUAGE_OPTIONS.filter(
    (lang) => Object.values(tabLanguages.value).indexOf(lang.value) === -1
  );
});

function addTab(lang: null | TrLanguage = null) {
  const newValue = tabs.value.length > 0 ? Math.max(...tabs.value) + 1 : 0;
  tabs.value.push(newValue);
  currentTab.value = newValue;
  const langs = filteredLanguageOptions.value;
  if (!lang) {
    // eslint-disable-next-line no-param-reassign
    lang =
      langs.findIndex((l) => l.value === locale.value.toUpperCase()) !== -1
        ? (locale.value.toUpperCase() as TrLanguage)
        : langs[0].value;
    emit('update:value', [
      ...props.value,
      { ...props.onCreate(), languageCode: lang },
    ]);
  }
  tabLanguages.value[newValue] = lang;
  tabHasErrors.value[newValue] = false;
}

function closeTab(tab: number) {
  const lang = tabLanguages.value[tab];

  emit(
    'update:value',
    props.value.filter((v) => v.languageCode !== lang)
  );
  delete tabLanguages.value[tab];
  delete tabHasErrors.value[tab];

  tabs.value.splice(
    tabs.value.findIndex((t) => t === tab),
    1
  );
  if (tab === currentTab.value) {
    currentTab.value = tabs.value[Math.min(tab, tabs.value.length - 1)];
  }
}

if (!props.value || props.value.length == 0) {
  addTab();
}

watch(
  () => props.value,
  () => {
    if (props.value && props.value.length > 0) {
      props.value.forEach((value, index) => {
        nextTick(() => {
          if (!Object.values(tabLanguages.value).includes(value.languageCode)) {
            addTab(value.languageCode);
          }
        });
      });
      currentTab.value = 0;
    }
  },
  { immediate: true }
);

const { formItems } = inject<{ formItems: Record<string, FormItemInst[]> }>(
  formItemInstsInjectionKey
)!;

async function beforeLeaveTab(
  activeTab: number,
  oldActiveTab: number
): Promise<boolean> {
  tabHasErrors.value[activeTab] = false;
  return await new Promise((resolve, reject) => {
    const shouldRuleBeApplied = () => true;
    const formItemValidationPromises = Object.entries(formItems)
      .filter(
        ([path, insts]) =>
          path && path.startsWith(`translations[${oldActiveTab}]`)
      )
      .flatMap(([path, insts]: [string, FormItemInst[]]) => {
        console.log(path, insts);
        return insts.map((inst) =>
          inst.internalValidate(null, shouldRuleBeApplied)
        );
      });
    void Promise.all(formItemValidationPromises).then((results) => {
      tabHasErrors.value[oldActiveTab] = results.some(
        (result) => !result.valid
      );
      resolve(true);
    });
  });
}
</script>

<style scoped>
.tabs ::v-deep(.n-tabs-tab) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.09) !important;
}
.tabs ::v-deep(.n-tab-pane) {
  border-left: 1px solid rgba(255, 255, 255, 0.09);
  border-right: 1px solid rgba(255, 255, 255, 0.09);
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
}
</style>
