<template>
  <div ref="container" w:m="5" w:text="white" w:pos="relative">
    <ClientOnly>
      <CalendarWidget
        ref="calendar"
        @create="createNewEvent"
        @select="selectEvent"
      />

      <MonthCalendarEventPopout
        v-if="calendar"
        :container="container"
        :event-el="selectedEvent.eventEl"
        :event="selectedEvent.event"
        :open="selectedEvent.open"
        @edit="editSelectedEvent"
      />
      <EventDialog
        v-if="calendar"
        v-model:is-open="eventDialog.open"
        :create="eventDialog.create"
        :event="eventDialog.event"
        :all-day="eventDialog.allDay"
        :refresh="calendar.refetch"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import {
  CalendarEventBySlugDocument,
  CalendarEventBySlugQuery,
  Event,
  TrLanguage,
} from '@app/graphql/dist/client';
import type { EventApi } from '@fullcalendar/vue3';

import type { ICalendarWidget } from '../components/Calendar/CalendarWidget.vue';
import { Trans } from '../i18n';

const handle = useClientHandle();
const container = ref<null | HTMLDivElement>(null);
const router = useRouter();
const route = useRoute();
const { locale } = useI18n();
const calendar = ref<ICalendarWidget | null>(null);

const selectedEvent = ref({
  event: null as NonNullable<CalendarEventBySlugQuery['eventBySlug']> | null,
  eventEl: null as HTMLElement | null,
  open: false,
});

const eventDialog = ref({
  open: false,
  event: {} as
    | Pick<Event, 'startsAt' | 'endsAt'>
    | NonNullable<CalendarEventBySlugQuery['eventBySlug']>,
  create: false,
  allDay: false,
});

const MonthCalendarEventPopout = useWaitImportComponent(
  computed(() => selectedEvent.value.open),
  () => import('../components/Calendar/CalendarEventPopout.vue')
);

const EventDialog = useWaitImportComponent(
  computed(() => eventDialog.value.open),
  () => import('../components/Calendar/EventDialog.vue')
);

watch(
  () => route.params.slug,
  async (slug) => {
    // Close popout
    if (!slug || typeof slug !== 'string') {
      selectedEvent.value.open = false;
      return;
    }
    const { data } = await handle.client
      .query(CalendarEventBySlugDocument, {
        languageCode: locale.value.toUpperCase() as TrLanguage,
        slug: slug,
      })
      .toPromise();
    const event = data?.eventBySlug;
    if (!event) return;
    if (!selectedEvent.value.eventEl) {
      await until(calendar).not.toBeNull();
      calendar.value!.api.gotoDate(event.startsAt);
      await until(() => calendar.value!.loading).toBe(false);
      const el = document.querySelector<HTMLElement>(`[data-id="${slug}"]`);
      if (!el) {
        console.warn('event el not found');
        return;
      }

      selectedEvent.value.eventEl = el;
    }

    selectedEvent.value.event = event as Event;
    selectedEvent.value.open = true;
  },
  { immediate: true }
);

async function selectEvent(event: EventApi, el: HTMLElement) {
  selectedEvent.value = {
    event: null,
    eventEl: el,
    open: false,
  };
  await nextTick();
  router.push(event.url);
}

async function editSelectedEvent() {
  await router.push(Trans.i18nRoute('CALENDAR'));
  await until(() => selectedEvent.value.open).not.toBeTruthy();
  await promiseTimeout(100);
  eventDialog.value = {
    event: selectedEvent.value.event!,
    create: false,
    open: true,
    allDay: false,
  };
}

async function createNewEvent(
  event: Pick<Event, 'startsAt' | 'endsAt'>,
  allDay: boolean
) {
  eventDialog.value = {
    event,
    create: true,
    open: true,
    allDay,
  };
}

useHead({
  title: computed(() => 'Calendar - SMil Aarhus'),
  meta: [
    {
      name: `description`,
      content: computed(() => ''),
    },
  ],
});
</script>
