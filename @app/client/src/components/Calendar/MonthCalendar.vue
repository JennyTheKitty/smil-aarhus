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
  formatRange,
  // eslint-disable-next-line import/no-duplicates
} from '@fullcalendar/vue3';
import { useClientHandle } from '@urql/vue';
import dayjs from 'dayjs';

import { useTranslation } from '../../utils';

const calendar = ref<null | typeof FullCalendar>(null);
const calendarApi = computed(() => calendar.value?.getApi() as Calendar | null);
const { locale } = useI18n();
const i18nRoute = inject(key.i18nRoute)!;
const router = useRouter();
const handle = useClientHandle();

const HOUR = 60 * 60 * 1000;
const BUFFER = HOUR / 2;

let events: EventInput[] = [];
const extendedOpening = [
  { start: 0, end: 7, day: 1 }, // Mon

  { start: 17, end: 24, day: 2 }, // Tue
  { start: 0, end: 7, day: 3 }, // Wed

  { start: 17, end: 24, day: 4 }, // Thu
  { start: 0, end: 7, day: 5 }, // Fri

  { start: 20, end: 24, day: 5 }, // Fri
  { start: 0, end: 17, day: 6 }, // Sat

  { start: 20, end: 24, day: 6 }, // Sat
  { start: 0, end: 24, day: 0 }, // Sun
].map((e) => ({ start: e.start * HOUR, end: e.end * HOUR, day: e.day }));

const extendedOpeningProps = {
  title: '',
  groupId: 'extendedOpening',
  display: 'block',
  classNames: ['extended-opening'],
};

watch(
  locale,
  () => {
    events = [];
    calendarApi.value?.refetchEvents();
    calendarApi.value?.setOption('locale', locale.value);
  },
  { immediate: true }
);

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
      nowIndicator: true,
    },
  },
  eventSources: [
    {
      id: 'cal',
      async events(info) {
        const variables = {
          // Fetch 24 hours prev, incase any events cross a week boundary
          startsAfter: dayjs(info.start).subtract(1, 'day').toISOString(),
          startsBefore: info.end.toISOString(),
        };
        // Run one-of query
        const result = await handle.client
          .query(CalendarEventsQueryDocument, variables)
          .toPromise();
        if (result.error) throw result.error;
        if (!result.data || !result.data.events) throw new Error('no data');

        // Turn into event input
        const newEvents = result.data.events.nodes
          .map((event) => useTranslation(event, locale))
          .map((e) => {
            const event = unref(e)!;
            return {
              id: event.id,
              title: event.title,
              start: new Date(event.startsAt),
              end: new Date(event.endsAt),
              url: router.resolve(
                i18nRoute({
                  name: 'calendar',
                  params: { slug: event.slug },
                })
              ).href,
              display: 'list-item',
            } as EventInput & { start: Date; end: Date };
          })
          .sort((a, b) => +a.start - +b.start);

        // Calc extended opening for this week
        const extendedOpeningEvents: EventInput[] = [];

        let start = dayjs(info.start);
        const end = dayjs(info.end);
        while (start.isBefore(end, 'day')) {
          const day = start.day();
          const millis = start.valueOf();

          for (const x of extendedOpening.filter((x) => x.day == day)) {
            let ss = millis + x.start;
            let ee = millis + x.end;

            // Check for events before
            for (const e of newEvents.filter(
              (e) =>
                e.end.valueOf() > ss - BUFFER &&
                e.end.valueOf() < ee + BUFFER &&
                e.start.valueOf() < ss - BUFFER
            )) {
              if ((e.end.valueOf() as number) + BUFFER > ss)
                ss = (e.end.valueOf() as number) + BUFFER;
            }

            // Check for events after
            for (const e of newEvents.filter(
              (e) =>
                e.start.valueOf() < ee + BUFFER &&
                e.start.valueOf() > ss - BUFFER &&
                e.end.valueOf() > ee + BUFFER
            )) {
              if ((e.start.valueOf() as number) - BUFFER < ee)
                ee = (e.start.valueOf() as number) - BUFFER;
            }

            // Check for events during
            for (const e of newEvents.filter(
              (e) =>
                e.start.valueOf() > ss - BUFFER && e.end.valueOf() < ee + BUFFER
            )) {
              extendedOpeningEvents.push({
                ...extendedOpeningProps,
                start: new Date(ss),
                end: new Date((e.start.valueOf() as number) - BUFFER),
              });
              ss = (e.end.valueOf() as number) + BUFFER;
            }

            if (ss < ee) {
              extendedOpeningEvents.push({
                ...extendedOpeningProps,
                start: new Date(ss),
                end: new Date(ee),
              });
            }
          }

          start = start.add(1, 'days');
        }

        events = [...events, ...newEvents].filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        );
        return [...events, ...extendedOpeningEvents];
      },
    },
  ],
  eventClick({ event, jsEvent }) {
    router.push(event.url);
    jsEvent.preventDefault();
  },
};
</script>

<style scoped src="./MonthCalendar.css" />
