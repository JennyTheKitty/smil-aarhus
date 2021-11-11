<template>
  <div
    w:bg="dark-800"
    w:rounded="2xl"
    w:m="5"
    w:shadow="lg"
    w:text="white"
    w:p="5"
    w:pos="relative"
  >
    <FullCalendar ref="calendar" :options="calendarOptions" />
  </div>
</template>

<script setup lang="ts">
// solves problem with Vite SSR
import '@fullcalendar/core/vdom.cjs';
// eslint-disable-next-line import/no-duplicates
import '@fullcalendar/vue3';

// eslint-enable simple-import-sort/imports
import { CalendarEventsQueryDocument } from '@app/graphql/dist/client';
import daLocale from '@fullcalendar/core/locales/da';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendar, {
  Calendar,
  CalendarOptions,
  EventContentArg,
  EventInput,
  // eslint-disable-next-line import/no-duplicates
} from '@fullcalendar/vue3';
import dayjs from 'dayjs';

import { useTranslation } from '../../utils';

const calendar = ref<null | typeof FullCalendar>(null);
const calendarApi = computed(() => calendar.value?.getApi() as Calendar | null);
const { locale } = useI18n();
const i18nRoute = inject(key.i18nRoute)!;
const router = useRouter();
const eventSuccessFn = ref<((input: EventInput[]) => void) | null>(null);

const variables = ref({
  startsAfter: '',
  startsBefore: '',
});
const { data } = useQuery({
  query: CalendarEventsQueryDocument,
  variables,
  pause: computed(() => eventSuccessFn.value === null),
});

let events: EventInput[] = [];

watch(
  locale,
  () => {
    events = [];
    calendarApi.value?.refetchEvents();
    calendarApi.value?.setOption('locale', locale.value);
  },
  { immediate: true }
);

watch([data, locale], ([data]) => {
  if (!eventSuccessFn.value || !data || !data.events) return;
  const newEvents = data.events.nodes
    .map((event) => useTranslation(event, locale))
    .map((e) => {
      const event = unref(e)!;
      return {
        id: event.id,
        title: event.title,
        start: event.startsAt,
        end: event.endsAt,
        url: router.resolve(
          i18nRoute({
            name: 'calendar',
            params: { eventSlug: event.slug },
          })
        ).href,
        display: 'list-item',
      } as EventInput;
    });
  events = [...events, ...newEvents].filter(
    (v, i, a) => a.findIndex((t) => t.id === v.id) === i
  );
  eventSuccessFn.value(events);
  eventSuccessFn.value = null;
});

const calendarOptions: CalendarOptions = {
  locales: [daLocale],
  locale: locale.value,
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
  initialView: 'timeGridWeek',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,listYear',
  },
  firstDay: 1,
  views: {
    dayGridMonth: {
      fixedWeekCount: false,
      aspectRatio: 2,
      weekNumbers: true,
      weekNumberFormat: { week: 'numeric' },
      showNonCurrentDates: false,
      dayMaxEventRows: 5,
      nextDayThreshold: '07:00:00',
    },
    timeGridWeek: {
      eventContent(
        { event }: EventContentArg,
        createElement: typeof FullCalendarVDom.createElement
      ) {
        return createElement('div', { class: 'fc-event-main-frame' }, [
          createElement('div', { class: 'fc-event-time' }, [
            `
            ${dayjs(event.start).format('LT')} -
            ${dayjs(event.end).format('LT')}
            `,
          ]),
          createElement('div', { class: 'fc-event-title-container' }, [
            createElement('div', { class: 'fc-event-title', fcSticky: true }, [
              `${event.title}`,
            ]),
          ]),
        ]);
      },
      slotDuration: '01:00:00',
      allDaySlot: false,
    },
  },
  eventSources: [
    {
      id: 'cal',
      events(info, success) {
        console.log(info);
        variables.value.startsAfter = info.start.toISOString();
        variables.value.startsBefore = info.end.toISOString();
        eventSuccessFn.value = success;
      },
    },
    {
      id: 'extended',
      events: [
        {
          startTime: '17:00:00',
          endTime: '20:00:00',
          title: 'Udvidet Åbningstid',
          daysOfWeek: [2],
        },
        {
          startTime: '20:00:00',
          endTime: '31:00:00',
          title: 'Udvidet Åbningstid',
          daysOfWeek: [2],
        },
        {
          startTime: '17:00:00',
          endTime: '20:00:00',
          title: 'Udvidet Åbningstid',
          daysOfWeek: [4],
        },
        {
          startTime: '20:00:00',
          endTime: '31:00:00',
          title: 'Udvidet Åbningstid',
          daysOfWeek: [4],
        },
        {
          startTime: '20:00:00',
          endTime: '31:00:00',
          title: 'Udvidet Åbningstid',
          daysOfWeek: [5],
        },
        {
          startTime: '07:00:00',
          endTime: '17:00:00',
          title: 'Udvidet Åbningstid',
          daysOfWeek: [6],
        },
        {
          startTime: '20:00:00',
          endTime: '31:00:00',
          title: 'Udvidet Åbningstid',
          daysOfWeek: [6],
        },
        {
          startTime: '07:00:00',
          endTime: '17:00:00',
          title: 'Udvidet Åbningstid',
          daysOfWeek: [0],
        },
        {
          startTime: '17:00:00',
          endTime: '20:00:00',
          title: 'Udvidet Åbningstid',
          daysOfWeek: [0],
        },
        {
          startTime: '20:00:00',
          endTime: '31:00:00',
          title: 'Udvidet Åbningstid',
          daysOfWeek: [0],
        },
      ],
      display: 'background',
      defaultAllDay: false,
    },
  ],
  eventClick({ event, jsEvent }) {
    router.push(event.url);
    jsEvent.preventDefault();
  },
};
</script>

<style scoped src="./MonthCalendar.css" />
