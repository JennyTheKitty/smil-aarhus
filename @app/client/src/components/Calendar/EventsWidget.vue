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
        :params="{ id: fromUUID(event.id), slug: event.slug }"
      >
        <div w:flex="~ col shrink-0" w:w="18" w:text="right" w:p="r-3 y-1">
          <ClientOnly>
            <span>{{ dayjs(event.startsAt).format('D MMM') }}</span>
            <span w:text="sm gray-400">
              {{ dayjs(event.startsAt).format('ddd') }}
            </span>
          </ClientOnly>
        </div>
        <div
          w:border="r-2"
          w:m="y-1"
          :style="{ borderColor: event.color || '' }"
        />
        <div w:flex="~ col" w:p="l-3 y-1">
          <span w:text="base white">{{ event.title }}</span>
          <span w:text="sm gray-400">
            <icon-mdi-clock-time-five-outline
              w:display="inline-block"
              w:m="b-0.5 -l-1 r-0.5"
            />
            <ClientOnly>
              {{ dayjs(event.startsAt).format('LT') }} -
              {{ dayjs(event.endsAt).format('LT') }}
            </ClientOnly>
          </span>
        </div>
      </i18n-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ShortEventFragment } from '@app/graphql/dist/client';
import dayjs from 'dayjs';

import { Translated } from '../../utils';

const { fromUUID } = useShort();

defineProps<{
  events: Translated<ShortEventFragment>[];
}>();
</script>
