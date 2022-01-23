<template>
  <div w:flex="~ col" w:align="items-center">
    <div w:grid="~ cols-1" w:space-y="2" w:w="max-content">
      <a
        v-for="{ raw, event } of events"
        w:bg="hover:dark-900"
        w:flex="~"
        w:m="t-1"
        w:w="full"
        w:border="rounded-xl"
        :href="event.def.url"
        @click="(e) => onClick(e, event)"
      >
        <div w:flex="~ col shrink-0" w:w="18" w:text="right" w:p="r-3 y-1">
          <span>{{ d(raw.startsAt).format('D MMM') }}</span>
          <span w:text="sm gray-400">
            {{ d(raw.startsAt).format('ddd') }}
          </span>
        </div>
        <div w:border="r-2 blue-500" w:m="y-1" />
        <div w:flex="~ col" w:p="x-3 y-1">
          <span w:text="base white">{{ raw.title }}</span>
          <span w:text="sm gray-400">
            <icon-mdi-clock-time-five-outline
              w:display="inline-block"
              w:m="b-0.5 -l-1 r-0.5"
            />
            {{ d(raw.startsAt).format('LT') }} -
            {{ d(raw.endsAt).format('LT') }}</span
          >
        </div>
      </a>

      <button @click="loadMore">Load more</button>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable import/no-duplicates */
// solves problem with Vite SSR
import '@fullcalendar/core/vdom.cjs';
import '@fullcalendar/vue3';

import {
  Calendar,
  EventApi,
  EventRenderRange,
  sliceEvents,
} from '@fullcalendar/vue3';
import dayjs from 'dayjs';
import { PropType } from 'vue';
import {
  listViewContext,
  listViewProps,
  listViewRange,
} from './CalendarListViewPlugin';
import { CalendarEventFragment } from '@app/graphql/dist/client';

const d = dayjs;
const { locale } = useI18n();

const props = defineProps({
  calendarAPI: { type: Object as PropType<Calendar | null>, required: true },
});

const events = computed(() => {
  return sliceEvents(listViewProps.value!)
    .filter((event) => event.def.groupId !== 'extendedOpening')
    .map((event) => ({
      raw: event.def.extendedProps.raw as CalendarEventFragment,
      event,
    }))
    .map(({ raw, event }) => ({
      raw: useTranslation(raw, locale),
      event,
    }));
});

function loadMore() {
  listViewRange.value!.end = dayjs(listViewRange.value!.end)
    .add(1, 'month')
    .toDate();
  props.calendarAPI?.changeView('list');
}

function onClick(jsEvent: MouseEvent, event: EventRenderRange) {
  listViewContext.value?.emitter.trigger('eventClick', {
    el: jsEvent.target as HTMLElement,
    event: new EventApi(listViewContext.value, event.def, event.instance!),
    jsEvent,
    view: listViewContext.value.viewApi,
  });
}
</script>
