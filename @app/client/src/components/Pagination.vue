<template>
  <div>
    <template v-for="button in buttons">
      <button v-if="button.type === 'prev'" @click="prev">Prev</button>
      <button v-if="button.type === 'goto'" @click="goto(button.page)">
        {{ button.page }}
      </button>
      <button v-if="button.type === 'next'" @click="next">Next</button>
    </template>
  </div>
</template>
<script lang="ts">
import { MaybeRef } from '@vueuse/core';
import { Ref, PropType } from 'vue';

export type PaginationControl = () => void;

export interface PaginationResult {
  pageSize: Ref<number>;
  total: Ref<number>;
  currentPage: Ref<number>;
  offset: Ref<number>;
  lastPage: Readonly<Ref<number>>;
  next: () => void;
  prev: () => void;
  goto: (page: number) => void;
  urql: Ref<{ offset: number; first: number }>;
}

export interface PaginationOptions {
  pageSize: MaybeRef<number>;
}

export function usePagination(options: PaginationOptions): PaginationResult {
  const _pageSize = ref(options.pageSize);
  const _currentPage = ref(1);
  const total = ref(0);
  const offset = ref(0);

  const pageSize = computed<number>({
    get: () => _pageSize.value,
    set: (v) => {
      _pageSize.value = v;
    },
  });

  const currentPage = computed<number>({
    get: () => _currentPage.value,
    set: (v) => {
      _currentPage.value = v;
      offset.value = (_currentPage.value - 1) * pageSize.value;
    },
  });

  const lastPage = computed(() => Math.ceil(total.value / pageSize.value));

  const prev = () => --currentPage.value;
  const next = () => ++currentPage.value;
  const goto = (page: number) => (currentPage.value = page);

  const urql = computed(() => ({
    first: pageSize.value,
    offset: offset.value,
  }));

  return {
    pageSize,
    currentPage,
    lastPage,
    offset,
    total,
    prev,
    next,
    goto,
    urql,
  };
}
</script>

<script setup lang="ts"></script>

<script setup lang="ts">
const props = defineProps<{
  pageSize: Ref<number>;
  total: Ref<number>;
  currentPage: Ref<number>;
  offset: Ref<number>;
  lastPage: Readonly<Ref<number>>;
  next: () => void;
  prev: () => void;
  goto: (page: number) => void;
  urql: Ref<{ offset: number; first: number }>;
}>();

// currentPage: { type: Number, required: true },
// total: { type: Number, required: true },
// lastPage: { type: Number, required: true },
// next: { type: Function as PropType<() => void>, required: true },
// prev: { type: Function as PropType<() => void>, required: true },
// goto: { type: Function as PropType<(page: number) => void>, required: true },

interface GotoButton {
  type: 'goto';
  page: number;
}

interface NextButton {
  type: 'next';
}

interface PrevButton {
  type: 'prev';
}

type Button = GotoButton | PrevButton | NextButton;

const buttons = computed<Button[]>(() => {
  if (!props.total) return [];
  const buttons: Button[] = [];
  if (props.currentPage.value !== 0) buttons.push({ type: 'prev' });

  buttons.push({ type: 'goto', page: props.currentPage.value });

  if (props.currentPage.value !== props.lastPage.value)
    buttons.push({ type: 'next' });
  return buttons;
});
</script>
