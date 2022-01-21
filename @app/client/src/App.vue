<template>
  <div w:bg="dark-500">
    <MemberBar v-if="store.currentMember" />
    <NavBar :links="navLinks" />
    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <transition
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-500 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          mode="out-in"
        >
          <div>
            <keep-alive>
              <component :is="Component"></component>
            </keep-alive>
          </div>
        </transition>
      </template>
    </router-view>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { InfoPagesQueryDocument } from '@app/graphql/dist/client';
import { Link } from './components/Nav/NavLink.vue';
import { useStore } from './store';

const { t } = useI18n();

provide(key.heroHeight, ref(0));

const { locale } = useI18n();
const store = useStore();

const { data } = useQuery({
  query: InfoPagesQueryDocument,
});
const pages = computed(() =>
  (data.value?.infoPages?.nodes || []).map((page) =>
    useTranslation(page, locale)
  )
);

const navLinks = computed(
  () =>
    [
      {
        name: t('nav.info'),
        links: pages.value.map((page) => ({
          name: page.title,
          description: page.subtitle,
          to: 'INFO',
          params: { slug: page.name },
          icon: page.icon,
        })),
        // [
        //   {
        //     name: 'Hvad er SMIL?',
        //     description: 'Generalt info om smil',
        //     to: 'INFO',
        //     icon: 'mdi:information-outline',
        //   },
        //   {
        //     name: 'Udvidet åbningstid',
        //     description: '???',
        //     to: 'INFO',
        //     icon: 'mdi:timelapse',
        //   },
        //   {
        //     name: 'SMIL Aarhus',
        //     description: 'Historie om SMIL Aarhus',
        //     to: 'INFO',
        //     icon: 'mdi:restore-alert',
        //   },
        //   {
        //     name: 'FAQ',
        //     description: 'Ofte stillede spørgsmål',
        //     to: 'INFO',
        //     icon: 'wpf:faq',
        //   },
        //   {
        //     name: 'Regler',
        //     description: 'God opførsel i SMIL',
        //     to: 'INFO',
        //     icon: 'mdi:clipboard-text',
        //   },
        //   {
        //     name: 'Lokaler',
        //     description: 'Billeder & info',
        //     to: 'INFO',
        //     icon: 'mdi:floor-plan',
        //   },
        // ],
        singleColumn: false,
      },
      {
        name: t('nav.pictures'),
        to: 'PICTURES',
      },
      {
        name: t('nav.groups'),
        to: 'GROUPS',
      },
      {
        name: t('nav.calendar'),
        to: 'CALENDAR',
      },
      {
        name: t('nav.news'),
        to: 'NEWS',
      },
    ] as Link[]
);
</script>
