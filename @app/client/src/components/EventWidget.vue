<template>
    <ul v-if="events.length" class="divide-y space-y-4 divide-gray-200">
        <li v-for="(event, i) in events" :key="i">
            <router-link
                v-if="event.value"
                class="block hover:bg-gray-900"
                :to="i18nRoute({ name: 'calendar', params: { eventSlug: event.value!.slug } })"
            >
                <div>
                    <div class="flex items-center justify-between">
                        <p class="text-md text-white md:truncate">{{ event.value!.title }}</p>
                    </div>
                    <div class="mt-2 sm:flex sm:justify-between">
                        <div class="sm:flex">
                            <p
                                class="flex font-light text-md text-gray-300 items-center"
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

const props = defineProps<{
    events: Translated<EventFragment>[]
}>();
const { t, d, locale } = useI18n();
const i18nRoute = inject(key.i18nRoute)!;
</script>
