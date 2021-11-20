import { EventInput, EventSourceFunc } from '@fullcalendar/core';
import dayjs from 'dayjs';

const HOUR = 60 * 60 * 1000;
const BUFFER = HOUR / 2;

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
        (e) => e.start.valueOf() > ss - BUFFER && e.end.valueOf() < ee + BUFFER
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

  return extendedOpeningEvents;
}
