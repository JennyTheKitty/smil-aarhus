<template>
  <FullCalendar ref="calendar" class="calendar" :options="calendarOptions" />
</template>

<script lang="ts">
export interface ICalendarWidget {
  api: ComputedRef<CalendarApi>;
  refetch(): void;
  loading: Ref<boolean>;
}
</script>

<script setup lang="ts">
// solves problem with Vite SSR
import '@fullcalendar/core/vdom.cjs';

import { Event } from '@app/graphql/dist/client';
import daLocale from '@fullcalendar/core/locales/da';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendar, {
  Calendar,
  CalendarApi,
  CalendarOptions,
  EventApi,
  EventContentArg,
  EventInput,
} from '@fullcalendar/vue3';
import { ComputedRef, Ref } from 'vue';

import listPlugin from './CalendarListViewPlugin';
import {
  calculateExtendedOpeningEvents as calcExtendedOpening,
  fetchEvents,
  formatTime,
  renderInnerContent,
} from './calendarUtils';

defineProps({
  filters: { type: Object, default: () => {} },
});
const emit = defineEmits({
  create: (event: Pick<Event, 'startsAt' | 'endsAt'>, allDay: boolean) => true,
  select: (event: EventApi, el: HTMLElement) => true,
});

const calendar = ref<any>(null);

const calendarApi = computed(
  () => calendar.value!.getApi() as Calendar | null,
  {
    onTrigger: () => {
      console.log('aa');
    },
  }
);
const { locale } = useI18n();
const router = useRouter();
const store = useStore();
const handle = useClientHandle();
const loading = ref(false);

let events: EventInput[] = [];

function refetch() {
  events = [];
  calendarApi.value?.refetchEvents();
}

nextTick(() => {
  watch(
    locale,
    () => {
      refetch();
      calendarApi.value?.setOption('locale', locale.value);

      calendarApi.value?.setOption('locale', locale.value);
    },
    { immediate: true }
  );

  watch(
    () => store.currentMember,
    (currentMember) => {
      calendarApi.value?.setOption('selectable', !!currentMember);
    },
    { immediate: true }
  );
});

const calendarOptions: CalendarOptions = {
  locales: [daLocale],
  locale: locale.value,
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  headerToolbar: {
    left: 'today prev next',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,list',
  },
  firstDay: 1,
  height: 'auto',
  selectable: false,
  select(info) {
    calendarApi.value!.unselect();
    emit(
      'create',
      { startsAt: info.startStr, endsAt: info.endStr },
      info.allDay
    );
  },
  selectOverlap: true,
  eventContent(
    arg: EventContentArg,
    createElement: typeof FullCalendarVDom.createElement
  ) {
    return renderInnerContent(
      calendarApi.value?.view.type!,
      arg,
      createElement
    );
  },

  views: {
    dayGridMonth: {
      fixedWeekCount: false,
      weekNumbers: true,
      weekNumberFormat: { week: 'numeric' },
      showNonCurrentDates: false,
      dayMaxEventRows: 5,
      nextDayThreshold: '07:00:00',
    },
    timeGridWeek: {
      slotDuration: '01:00:00',
      titleFormat: ({ start, end, localeCodes }) => {
        if (calendar.value.getApi() === undefined) return '';
        let str = calendarApi.value!.formatRange(start.marker, end!.marker, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        str += ` (${calendarApi.value!.formatDate(start.marker, {
          week: 'short',
        })})`;
        return str;
      },
      allDaySlot: false,
      eventMinHeight: 10,
      nowIndicator: true,
      slotLabelFormat: ({ date }) => {
        if (date.marker.getHours() > 0) {
          const d = new Date(date.marker);
          d.setHours(date.marker.getHours() - 1);
          return formatTime(d);
        }
        return formatTime(new Date(0, 0, 0, 23));
      },
    },
  },
  eventSources: [
    {
      id: 'cal',
      async events(info) {
        const newEvents = await fetchEvents(info, handle, locale, router);
        // Calc extended opening for this week
        const eoEvents = calcExtendedOpening(info, newEvents);
        // Make unique
        events = [...newEvents, ...events].filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        );
        return [...events, ...eoEvents];
      },
    },
  ],
  async eventClick({ event, jsEvent, el }) {
    // el is "a", do not go to href
    jsEvent.preventDefault();
    emit('select', event, el);
  },
  loading(isLoading) {
    loading.value = isLoading;
  },
};

defineExpose({ api: calendarApi, refetch, loading });
</script>

<style scoped src="./CalendarWidget.css" />
