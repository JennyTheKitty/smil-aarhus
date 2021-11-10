<template>
  <ul v-if="events.length">
    <li v-for="(event, i) in events" :key="i">
      <router-link
        v-if="event.value"
        w:bg="hover:dark-900"
        w:flex="~"
        w:m="t-1"
        :to="i18nRoute({ name: 'calendar', params: { eventSlug: event.value!.slug } })"
      >
        <div w:flex="~ col shrink-0" w:w="18" w:text="right" w:p="r-3 y-1">
          <span>{{ dayjs(event.value!.startsAt).format('D MMM') }}</span>
          <span w:text="sm gray-500">
            {{ dayjs(event.value!.startsAt).format('ddd') }}
          </span>
        </div>
        <div w:border="r-2 blue-500" w:m="y-1" />
        <div w:flex="~ col" w:p="l-3 y-1">
          <span w:text="base white">{{ event.value!.title }}</span>
          <span w:text="sm gray-500">
            <icon-mdi-clock-time-five-outline
              w:display="inline-block"
              w:m="b-0.5 -l-1 r-0.5"
            />
            {{dayjs(event.value!.startsAt).format('LT') }} -
            {{dayjs(event.value!.endsAt).format('LT')}}</span
          >
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { EventFragment } from '@app/graphql/dist/client';
import dayjs from 'dayjs';

import { Translated } from '../../utils';

defineProps<{
  events: Translated<EventFragment>[];
}>();
const { d } = useI18n();
const i18nRoute = inject(key.i18nRoute)!;
</script>
