<template>
    <div>
        <div w:h="full" w:rounded="2xl" w:m="5" w:max-h="50vh" w:pos="relative">
            <picture>
                <source
                    srcset="../assets/images/artem-labunsky-whsB1P4Kblc-unsplash.jpg?w=300;900;1500;2000&format=webp&srcset&metadata=width;height"
                    type="image/webp"
                />
                <source
                    srcset="../assets/images/artem-labunsky-whsB1P4Kblc-unsplash.jpg?w=300;900;1500;2000&format=jpg&srcset"
                    type="image/webp"
                />
                <img
                    alt
                    w:object="cover"
                    w:rounded="2xl"
                    w:w="full"
                    w:max-h="50vh"
                    w:filter="~ brightness-25"
                    v-bind="imgDimensions"
                />
            </picture>
            <div
                w:flex="~ col"
                w:h="full"
                w:w="full"
                w:pos="top-0 absolute"
                w:align="items-center"
                w:justify="center"
                w:p="4"
                w:space="y-1 sm:y-5"
                w:text="white center"
            >
                <h1
                    w:font="bold"
                    w:text="space-pre-line 2xl sm:4xl md:5xl lg:6xl"
                >{{ t('hero.title') }}</h1>
                <span w:text="sm sm:md">{{ t('hero.subtitle') }}</span>
                <div w:flex="~ row" w:space="x-10" w:p="t-1 sm:t-5">
                    <button class="btn-hero">
                        <span>{{ t('hero.buttons.signup') }}</span>
                    </button>
                    <button class="btn-hero">
                        <span>{{ t('hero.buttons.pictures') }}</span>
                    </button>
                </div>
            </div>
        </div>

        <div w:m="x-auto" w:text="white" w:max-w="7xl">
            <div w:flex="~ col lg:row" w:p="y-4 x-4">
                <div w:w="lg:7/10">
                    <a
                        href="#"
                        class="btn-focus-ring"
                        w:rounded="lg"
                        w:cursor="pointer"
                        w:m="auto"
                        w:shadow="lg"
                        w:w="full"
                        w:max-w="2xl"
                        w:display="block"
                        w:overflow="hidden"
                    >
                        <div w:bg="dark-800" w:w="full" w:p="4">
                            <p w:font="medium" w:text="base pink-500">{{ t('home.latest-news') }}</p>
                            <p w:font="medium" w:text="xl white" w:m="b-2">Coronagenåbning!!</p>
                            <p
                                w:font="light"
                                w:text="base gray-300"
                            >Efter at være lukket i lang tid, er SMIL Aarhus lokaler endelig åbne igen...</p>
                        </div>
                    </a>
                    <main
                        role="main"
                        w:rounded="lg"
                        w:bg="dark-800"
                        w:shadow="lg"
                        w:m="t-5"
                        w:w="full"
                        w:p="8"
                    >
                        <!-- eslint-disable-next-line vue/no-v-html -->
                        <div class="content" v-html="page?.content"></div>
                    </main>
                </div>
                <aside w:m="x-auto" w:w="full lg:3/10" w:max-w="2xl" w:p="lg:l-4 <lg:t-4">
                    <div w:flex="~ col" w:space="y-5" w:w="full">
                        <div v-if="specialEvent" w:rounded="lg" w:shadow="lg" w:overflow="hidden">
                            <div w:bg="dark-800" w:w="full" w:p="4">
                                <p
                                    w:font="medium"
                                    w:text="base pink-500"
                                >{{ t('home.special-events') }}</p>
                                <EventWidget :events="[specialEvent]" />
                            </div>
                        </div>
                        <div w:rounded="lg" w:shadow="lg" w:overflow="hidden">
                            <div w:bg="dark-800" w:w="full" w:p="4">
                                <p
                                    w:font="medium"
                                    w:text="base pink-500"
                                >{{ t('home.upcoming-events') }}</p>
                                <EventWidget :events="events" />
                                <router-link
                                    :to="i18nRoute({ name: 'calendar' })"
                                    w:text="base underline"
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

// @ts-ignores
// eslint-disable-next-line import/no-unresolved
import imgDimensions from '../assets/images/artem-labunsky-whsB1P4Kblc-unsplash.jpg?metadata=width;height'
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
