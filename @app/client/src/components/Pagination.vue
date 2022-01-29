<template>
  <div class="pagination" w:w="full sm:xl">
    <button
      class="prev"
      w:border="pink-500 1 rounded-md disabled:grey-500"
      w:p="r-3 l-1 y-1"
      w:flex="~"
      w:align="items-center"
      :disabled="currentPage.value === 1"
      @click="prev"
    >
      <icon-mdi-chevron-left w:text="lg" />
      Prev
    </button>
    <div>
      <template v-for="button in buttons">
        <button
          class="number"
          w:text="pink-500"
          w:p="x-2"
          w:pointer="none"
          v-if="button.type === 'ellipsis'"
        >
          ...
        </button>
        <button
          class="number"
          w:text="grey-500 underline"
          w:p="x-2"
          w:pointer="none"
          v-if="button.type === 'goto' && button.page == currentPage.value"
        >
          {{ button.page }}
        </button>
        <button
          class="number"
          w:text="pink-500"
          w:p="x-2"
          v-else-if="button.type === 'goto'"
          @click="goto(button.page)"
        >
          {{ button.page }}
        </button>
      </template>
    </div>
    <button
      class="next"
      w:border="pink-500 1 rounded-md disabled:grey-500"
      w:p="l-3 r-1 y-1"
      w:flex="~"
      w:align="items-center"
      :disabled="currentPage.value === lastPage.value"
      @click="next"
    >
      Next
      <icon-mdi-chevron-right w:text="lg" />
    </button>
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

interface GotoButton {
  type: 'goto';
  page: number;
}

interface EllipsisButton {
  type: 'ellipsis';
}

type Button = GotoButton | EllipsisButton;

const buttons = computed<Button[]>(() => {
  if (!props.total) return [];
  const buttons: Button[] = [];
  const cur = props.currentPage.value;
  const max = props.lastPage.value;

  if (cur < 4) {
    for (let i = cur - 1; i > 0; i--) {
      buttons.splice(0, 0, { type: 'goto', page: i });
    }
  } else if (cur > max - 5) {
    for (let i = cur - 1; i > max - 5; i--) {
      buttons.splice(0, 0, { type: 'goto', page: i });
    }
  } else {
    buttons.push({ type: 'goto', page: cur - 1 });
  }

  buttons.push({ type: 'goto', page: cur });

  if (cur < 4) {
    for (let i = cur + 1; i < Math.min(5, max + 1); i++) {
      buttons.push({ type: 'goto', page: i });
    }
  } else if (cur > max - 3) {
    for (let i = cur + 1; i < max + 1; i++) {
      buttons.push({ type: 'goto', page: i });
    }
  } else {
    buttons.push({ type: 'goto', page: cur + 1 });
  }

  if ((buttons[buttons.length - 1] as GotoButton).page !== max) {
    buttons.push({ type: 'ellipsis' });
    buttons.push({ type: 'goto', page: max });
  }
  if ((buttons[0] as GotoButton).page !== 1) {
    buttons.splice(0, 0, { type: 'ellipsis' });
    buttons.splice(0, 0, { type: 'goto', page: 1 });
  }
  return buttons;
});
</script>

<style lang="scss" scoped>
.pagination {
  display: grid;
  grid-template-columns: min-content 1fr min-content;
  place-content: center;
  place-items: center;
}
</style>
