import { CalendarEventsQueryDocument } from '@app/graphql/dist/client';
import {
  EventContentArg,
  EventInput,
  EventSourceFunc,
  Fragment,
} from '@fullcalendar/core';
import { ClientHandle } from '@urql/vue';
import dayjs from 'dayjs';
import { ComputedRef, Ref } from 'vue';
import { Router } from 'vue-router';

import { i18n, Trans } from '../../i18n';

const HOUR = 60 * 60 * 1000;
const BUFFER = HOUR / 2;

const EXTENDED_OPENING = [
  { start: 0, end: 7, day: 1 }, // Mon

  { start: 17, end: 24, day: 2 }, // Tue
  { start: 0, end: 7, day: 3 }, // Wed

  { start: 17, end: 24, day: 3 }, // Wed
  { start: 0, end: 7, day: 4 }, // Thu

  { start: 17, end: 24, day: 4 }, // Thu
  { start: 0, end: 7, day: 5 }, // Fri

  { start: 20, end: 24, day: 5 }, // Fri
  { start: 0, end: 17, day: 6 }, // Sat

  { start: 20, end: 24, day: 6 }, // Sat
  { start: 0, end: 24, day: 0 }, // Sun
].map((e) => ({ start: e.start * HOUR, end: e.end * HOUR, day: e.day }));

const EXTENDED_OPENING_PROPS = {
  title: 'Udvidet åbningstid',
  groupId: 'extendedOpening',
  display: 'block',
  classNames: ['extended-opening'],
};

export async function fetchEvents(
  info: Parameters<EventSourceFunc>[0],
  handle: ClientHandle,
  locale: Ref<string>,
  router: Router
): Promise<(EventInput & { start: Date; end: Date })[]> {
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

  // Turn into event input
  const events = result.data.events
    .map((event) => useTranslation(event, locale))
    .map((event) => {
      return {
        id: event.slug,
        title: event.title,
        start: new Date(event.startsAt),
        end: new Date(event.endsAt),
        url: router.resolve(Trans.i18nRoute('CALENDAR', { slug: event.slug }))
          .href,
        display: 'list-item',
      } as EventInput & { start: Date; end: Date };
    })
    .sort((a, b) => +a.start - +b.start);

  return events;
}

export function calculateExtendedOpeningEvents(
  info: Parameters<EventSourceFunc>[0],
  newEvents: (EventInput & { start: Date; end: Date })[]
): EventInput[] {
  const extendedOpeningEvents: EventInput[] = [];

  let start = dayjs(info.start);
  const end = dayjs(info.end);
  while (start.isBefore(end, 'day')) {
    const day = start.day();
    const millis = start.valueOf();

    for (const x of EXTENDED_OPENING.filter((x) => x.day == day)) {
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
        (e) => e.start.valueOf() > ss - BUFFER && e.end.valueOf() < ee + BUFFER
      )) {
        extendedOpeningEvents.push({
          ...EXTENDED_OPENING_PROPS,
          start: new Date(ss),
          end: new Date((e.start.valueOf() as number) - BUFFER),
        });
        ss = (e.end.valueOf() as number) + BUFFER;
      }

      if (ss < ee) {
        extendedOpeningEvents.push({
          ...EXTENDED_OPENING_PROPS,
          start: new Date(ss),
          end: new Date(ee),
        });
      }
    }

    start = start.add(1, 'days');
  }

  return extendedOpeningEvents;
}

export function renderInnerContent(
  view: string,
  { event, borderColor, backgroundColor }: EventContentArg,
  createElement: typeof FullCalendarVDom.createElement
) {
  if (view !== 'timeGridWeek' && event.groupId === 'extendedOpening') {
    return [];
  }

  if (view == 'listYear') {
    let url = event.url;
    let anchorAttrs = url ? { href: url } : {};

    return createElement('a', anchorAttrs, [event.title]);
  } else if (view == 'dayGridMonth') {
    return createElement(
      Fragment,
      null,
      createElement('div', {
        className: 'fc-daygrid-event-dot',
        'data-id': event.id,
        style: {
          borderColor: borderColor || backgroundColor,
        },
      }),
      createElement('div', { className: 'fc-event-time' }, [
        `${dayjs(event.start).format('LT')}`,
      ]),
      createElement('div', { className: 'fc-event-title' }, event.title)
    );
  } else if (view == 'timeGridWeek') {
    return createElement(
      'div',
      {
        class: 'fc-event-main-frame',
        'data-id': event.id,
      },
      [
        createElement('div', { class: 'fc-event-title-container' }, [
          createElement('div', { class: 'fc-event-title', fcSticky: true }, [
            `${event.title}`,
          ]),
        ]),
        createElement('div', { class: 'fc-event-time' }, [
          `
            ${dayjs(event.start).format('LT')} -
            ${dayjs(event.end).format('LT')}
            `,
        ]),
      ]
    );
  }
}

export function formatTime(date: Date, short = true) {
  const locale = (i18n.global.locale as unknown as ComputedRef<string>).value;
  const d = dayjs(date);
  if (locale == 'da') {
    if (short && d.minute() == 0) {
      return d.format('HH:mm');
    } else {
      return d.format('HH:mm');
    }
  } else if (locale == 'en') {
    if (short && d.minute() == 0) {
      return d.format('h A');
    } else {
      return d.format('h:mm A');
    }
  }
  return '';
}
