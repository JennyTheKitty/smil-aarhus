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
import '@fullcalendar/core/vdom.cjs'
// eslint-disable-next-line import/no-duplicates
import '@fullcalendar/vue3';

// eslint-enable simple-import-sort/imports
import { CalendarEventsQueryDocument } from '@app/graphql/dist/client';
import daLocale from '@fullcalendar/core/locales/da';
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';
// eslint-disable-next-line import/no-duplicates
import FullCalendar, { CalendarOptions, EventInput } from '@fullcalendar/vue3'

import { useTranslation } from '../utils';


const calendar = ref<null | typeof FullCalendar>(null);
const { locale } = useI18n();
const i18nRoute = inject(key.i18nRoute)!;
const router = useRouter()

let eventSuccessFn = ref<((input: EventInput[]) => void) | null>(null);

const variables = ref({
  startsAfter: '',
  startsBefore: ''
});
const options = computed(() => ({
  enabled: eventSuccessFn.value !== null
}));
const { onResult } = useQuery(CalendarEventsQueryDocument, variables, options);

onResult((result) => {
  const events = result.data?.events!.nodes.map(event => useTranslation(event, locale)).map(event => ({
    title: event.value!.title,
    start: event.value!.startsAt,
    end: event.value!.startsAt,
    url: router.resolve(i18nRoute({ name: 'calendar', params: { eventSlug: event.value!.slug } })).href,
  } as EventInput));
  if (events && eventSuccessFn.value) eventSuccessFn.value(events);
})

onMounted(() => {
  watch(locale, () => {
    calendar.value!.getApi().refetchEvents();
  });
});

const calendarOptions: CalendarOptions = {
  locales: [daLocale],
  locale: locale.value,
  plugins: [dayGridPlugin, listPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,listYear'
  },
  // headerToolbar: false,
  fixedWeekCount: false,
  aspectRatio: 2.5,
  weekNumbers: true,
  weekNumberFormat: { week: 'numeric' },
  eventTimeFormat: {
    hour: 'numeric',
    minute: '2-digit',
    meridiem: false
  },
  firstDay: 1,
  showNonCurrentDates: false,
  dayMaxEventRows: 5,
  events(info, success) {
    variables.value.startsAfter = info.start.toISOString();
    variables.value.startsBefore = info.end.toISOString();
    // @ts-ignore
    eventSuccessFn.value = success;
  },
  eventClick({ event, jsEvent }) {
    router.push(event.url);
    jsEvent.preventDefault();
  }
};

onMounted(() => {
  watch(locale, () => {
    calendar.value!.getApi().setOption('locale', locale.value);
  }, { immediate: true })
})

</script>

<style scoped src="./EventCalendar.css" />
