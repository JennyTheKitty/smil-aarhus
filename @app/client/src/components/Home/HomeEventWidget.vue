<template>
  <ul v-if="events.length">
    <li v-for="(event, i) in events" :key="i">
      <i18n-link
        v-if="event"
        w:bg="hover:dark-900"
        w:flex="~"
        w:m="t-1"
        class="btn-focus-ring"
        to="CALENDAR"
        :params="{ eventSlug: event.slug }"
      >
        <div w:flex="~ col shrink-0" w:w="18" w:text="right" w:p="r-3 y-1">
          <span>{{ dayjs(event.startsAt).format('d MMM') }}</span>
          <span w:text="sm gray-400">
            {{ dayjs(event.startsAt).format('ddd') }}
          </span>
        </div>
        <div w:border="r-2 blue-500" w:m="y-1" />
        <div w:flex="~ col" w:p="l-3 y-1">
          <span w:text="base white">{{ event.title }}</span>
          <span w:text="sm gray-400">
            <icon-mdi-clock-time-five-outline
              w:display="inline-block"
              w:m="b-0.5 -l-1 r-0.5"
            />
            {{ dayjs(event.startsAt).format('LT') }} -
            {{ dayjs(event.endsAt).format('LT') }}</span
          >
        </div>
      </i18n-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { Event } from '@app/graphql/dist/client';
import dayjs from 'dayjs';

import { Translated } from '../../utils';

defineProps<{
  events: Translated<Event>[];
}>();
</script>
