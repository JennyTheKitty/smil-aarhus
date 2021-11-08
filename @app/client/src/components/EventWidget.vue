<template>
    <ul v-if="events.length" w:divide="y gray-200" w:space="y-4">
        <li v-for="(event, i) in events" :key="i">
            <router-link
                v-if="event.value"
                w:display="block"
                w:bg="hover:gray-900"
                :to="i18nRoute({ name: 'calendar', params: { eventSlug: event.value!.slug } })"
            >
                <div>
                    <div w:flex="~" w:align="items-center" w:justify="between">
                        <p w:text="base white md:truncate">{{ event.value!.title }}</p>
                    </div>
                    <div w:m="t-2" w:flex="sm:~" w:justify="sm:between">
                        <div w:flex="sm:~">
                            <p
                                w:flex="~"
                                w:font="light"
                                w:text="base gray-300"
                                w:align="items-center"
                            >{{ d(event.value!.startsAt, 'long') }}</p>
                        </div>
                    </div>
                </div>
            </router-link>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { EventFragment } from '@app/graphql/dist/client';

import { Translated } from '../utils';

defineProps<{
    events: Translated<EventFragment>[]
}>();
const { d } = useI18n();
const i18nRoute = inject(key.i18nRoute)!;
</script>
