<template>
  <div ref="container" w:m="5" w:text="white" w:pos="relative">
    <FullCalendar ref="calendar" :options="calendarOptions" />
    <MonthCalendarEventPopout
      :container="container"
      :event-el="selectedEvent.eventEl"
      :event="selectedEvent.translatedEvent"
      :open="selectedEvent.open"
      @edit="editSelectedEvent"
    />
    <EventDialog
      v-model:is-open="eventDialogIsOpen"
      :create="eventDialogCreate"
      :event="eventDialogEvent"
      :refresh="refetch"
    />
  </div>
</template>

<script setup lang="ts">
// solves problem with Vite SSR
import '@fullcalendar/core/vdom.cjs';
// eslint-disable-next-line import/no-duplicates
import '@fullcalendar/vue3';

import {
  CalendarEventBySlugDocument,
  CalendarEventBySlugQuery,
  CalendarEventsQueryDocument,
  Event,
  TrLanguage,
} from '@app/graphql/dist/client';
import daLocale from '@fullcalendar/core/locales/da';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendar, {
  Calendar,
  CalendarOptions,
  EventContentArg,
  EventInput,
  // eslint-disable-next-line import/no-duplicates
} from '@fullcalendar/vue3';
import { useClientHandle } from '@urql/vue';
import { promiseTimeout } from '@vueuse/shared';
import dayjs from 'dayjs';

import { Trans } from '../../i18n';
import { useStore } from '../../store';
import { Translated, useTranslation } from '../../utils';
import { calculateExtendedOpeningEvents } from './extendedOpening';

const eventDialogIsOpen = ref(false);
// TODO: Somehow extract inner CalendarGetEventBySlugQuery.eventTrBySlugAndLanguageCode.event
const selectedEvent = ref<{
  event: NonNullable<CalendarEventBySlugQuery['eventBySlug']> | null;
  translatedEvent: Translated<
    NonNullable<CalendarEventBySlugQuery['eventBySlug']>
  > | null;
  eventEl: HTMLElement | null;
  open: boolean;
}>({ event: null, translatedEvent: null, eventEl: null, open: false });

const MonthCalendarEventPopout = useWaitImportComponent(
  computed(() => selectedEvent.value.open),
  () => import('./MonthCalendarEventPopout.vue')
);

const EventDialog = useWaitImportComponent(
  eventDialogIsOpen,
  () => import('./EventDialog.vue')
);

const calendar = ref<null | typeof FullCalendar>(null);
const container = ref<null | HTMLDivElement>(null);
const calendarApi = computed(() => calendar.value?.getApi() as Calendar | null);
const { locale } = useI18n();
const router = useRouter();
const route = useRoute();
const store = useStore();
const handle = useClientHandle();
const loading = ref(false);

const eventDialogEvent = ref({});
const eventDialogCreate = ref(true);

async function editSelectedEvent() {
  await router.push(Trans.i18nRoute('CALENDAR'));
  await until(() => selectedEvent.value.open).not.toBeTruthy();
  await promiseTimeout(100);
  eventDialogEvent.value = selectedEvent.value.event!;
  eventDialogCreate.value = false;
  eventDialogIsOpen.value = true;
}

watch(
  () => route.params.slug,
  async (slug) => {
    if (!slug || typeof slug !== 'string') {
      selectedEvent.value.open = false;
      return;
    }
    const { data } = await handle.client
      .query(
        CalendarEventBySlugDocument,
        {
          languageCode: locale.value.toUpperCase() as TrLanguage,
          slug: slug,
        },
        // TODO: Figure out how to use cache for this with updating and such
        { requestPolicy: 'cache-and-network' }
      )
      .toPromise();
    const event = data?.eventBySlug;
    console.log(event);
    if (!event) return;
    const translatedEvent = useTranslation(event, locale);
    if (!selectedEvent.value.eventEl) {
      if (calendarApi.value) calendarApi.value.gotoDate(event.startsAt);
      await until(loading).toBe(false);
      const el = document.querySelector<HTMLElement>(
        `.fc-event-main-frame[data-id="${slug}"]`
      );
      if (!el) {
        console.warn('event el not found');
        return;
      }

      selectedEvent.value.eventEl = el;
    }

    selectedEvent.value.translatedEvent = translatedEvent as Translated<Event>;
    selectedEvent.value.event = event as Event;
    selectedEvent.value.open = true;
  },
  { immediate: true }
);

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
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,listYear',
  },
  firstDay: 1,
  height: 'auto',
  selectable: false,
  select(info) {
    calendarApi.value!.unselect();
    eventDialogIsOpen.value = true;
    eventDialogCreate.value = true;
    eventDialogEvent.value = {
      startsAt: info.startStr,
      endsAt: info.endStr,
    };
  },
  selectOverlap: true,
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
      eventContent(
        { event }: EventContentArg,
        createElement: typeof FullCalendarVDom.createElement
      ) {
        return createElement(
          'div',
          {
            class: 'fc-event-main-frame',
            'data-id': event.id,
          },
          [
            createElement('div', { class: 'fc-event-time' }, [
              `
            ${dayjs(event.start).format('LT')} -
            ${dayjs(event.end).format('LT')}
            `,
            ]),
            createElement('div', { class: 'fc-event-title-container' }, [
              createElement(
                'div',
                { class: 'fc-event-title', fcSticky: true },
                [`${event.title}`]
              ),
            ]),
          ]
        );
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
          .query(CalendarEventsQueryDocument, variables, {
            // TODO: Figure out how to use cache for this with updating and such
            requestPolicy: 'cache-and-network',
          })
          .toPromise();
        if (result.error) throw result.error;
        if (!result.data || !result.data.events) throw new Error('no data');
        console.log(result.data);

        // Turn into event input
        const newEvents = result.data.events.nodes
          .map((event) => useTranslation(event, locale))
          .map((event) => {
            return {
              id: event.slug,
              title: event.title,
              start: new Date(event.startsAt),
              end: new Date(event.endsAt),
              url: router.resolve(
                Trans.i18nRoute('CALENDAR', { slug: event.slug })
              ).href,
              display: 'list-item',
            } as EventInput & { start: Date; end: Date };
          })
          .sort((a, b) => +a.start - +b.start);

        // Calc extended opening for this week
        const extendedOpeningEvents = calculateExtendedOpeningEvents(
          info,
          newEvents
        );

        events = [...newEvents, ...events].filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        );
        return [...events, ...extendedOpeningEvents];
      },
    },
  ],
  eventClick({ event, jsEvent, el }) {
    selectedEvent.value = {
      event: null,
      eventEl: el,
      open: false,
      translatedEvent: null,
    };
    router.push(event.url);
    jsEvent.preventDefault();
  },
  loading(isLoading) {
    loading.value = isLoading;
  },
};
</script>

<style scoped src="./MonthCalendar.css" />
