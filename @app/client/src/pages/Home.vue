<template>
    <div>
        <div class="h-full rounded-2xl m-5 max-h-50vh relative">
            <picture>
                <source
                    srcset="../assets/images/artem-labunsky-whsB1P4Kblc-unsplash.jpg?w=300;900;1500;2000&webp&srcset"
                    type="image/webp"
                />
                <img
                    alt="Thing"
                    class="object-cover rounded-2xl w-full max-h-50vh filter brightness-25"
                />
            </picture>
            <div
                class="flex flex-col h-full space-y-1 text-white text-center w-full p-4 top-0 absolute items-center justify-center sm:space-y-5"
            >
                <h1
                    class="font-bold text-2xl whitespace-pre-line sm:text-4xl md:text-5xl lg:text-6xl"
                >{{ t('hero.title') }}</h1>
                <span class="text-sm sm:text-md">{{ t('hero.subtitle') }}</span>
                <div class="flex space-x-10 pt-1 sm:pt-5">
                    <button
                        class="rounded-full flex font-semibold border-2 border-gray-200 text-sm py-1.5 pr-4 pl-4 transition ease-in duration-200 items-center group relative sm:text-md hover:(bg-gray-200 text-black) focus:outline-none active:top-0.5 focus-visible:(bg-gray-200 text-black) "
                    >
                        <span>{{ t('hero.buttons.signup') }}</span>
                    </button>
                    <button
                        class="rounded-full flex font-semibold border-2 border-gray-200 text-sm py-1.5 pr-4 pl-4 transition ease-in duration-200 items-center group relative sm:text-md hover:(bg-gray-200 text-black) focus:outline-none active:top-0.5 focus-visible:(bg-gray-200 text-black) "
                    >
                        <span>{{ t('hero.buttons.pictures') }}</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="mx-auto text-white max-w-7xl">
            <div class="flex flex-col py-4 px-4 lg:flex-row">
                <div class="lg:w-7/10">
                    <a
                        href="#"
                        class="rounded-lg cursor-pointer m-auto shadow-lg w-full max-w-2xl block btn-focus-ring overflow-hidden"
                    >
                        <div class="bg-dark-800 w-full p-4">
                            <p class="font-medium text-md text-pink-500">{{ t('home.latest-news') }}</p>
                            <p class="font-medium text-xl text-white mb-2">Coronagenåbning!!</p>
                            <p
                                class="font-light text-md text-gray-300"
                            >Efter at være lukket i lang tid, er SMIL Aarhus lokaler endelig åbne igen...</p>
                        </div>
                    </a>
                    <main role="main" class="rounded-lg bg-dark-800 shadow-lg mt-5 w-full p-8">
                        <!-- eslint-disable-next-line vue/no-v-html -->
                        <div class="content" v-html="page?.content"></div>
                    </main>
                </div>
                <aside class="mx-auto w-full max-w-2xl lg:pl-4 lg:w-3/10 <lg:pt-4">
                    <div class="flex flex-col space-y-5 w-full">
                        <div v-if="specialEvent" class="rounded-lg shadow-lg overflow-hidden">
                            <div class="bg-dark-800 w-full p-4">
                                <p
                                    class="font-medium text-md text-pink-500"
                                >{{ t('home.special-events') }}</p>
                                <EventWidget :events="[specialEvent]" />
                            </div>
                        </div>
                        <div class="rounded-lg shadow-lg overflow-hidden">
                            <div class="bg-dark-800 w-full p-4">
                                <p
                                    class="font-medium text-md text-pink-500"
                                >{{ t('home.upcoming-events') }}</p>
                                <EventWidget :events="events" />
                                <router-link
                                    :to="i18nRoute({ name: 'calendar' })"
                                    class="underline"
                                >{{ t('home.goto-calendar') }}</router-link>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { HomeEventsQueryDocument, PageQueryDocument } from '@app/graphql/dist/client';

import { useTranslation } from '../utils';

const { t, locale } = useI18n();
const i18nRoute = inject(key.i18nRoute)!;

const now = new Date();
const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));;

const { result: eventsResult } = useQuery(HomeEventsQueryDocument, { startsAfter: today.toISOString() });
const events = computed(() => useResult(eventsResult, [], data => data.events.nodes).value.map(event => useTranslation(event, locale)));
const specialEvent = computed(() => useTranslation(useResult(eventsResult, null, data => data.specialEvents.nodes[0]), locale));

const { result: pageResult } = useQuery(PageQueryDocument, { name: 'home' })
const page = useTranslation(useResult(pageResult, null, data => data.page), locale);
</script>
