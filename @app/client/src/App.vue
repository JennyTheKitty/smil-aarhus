<template>
  <div w:bg="dark-500">
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
import { Link } from './components/Nav/NavLink.vue';

const { t } = useI18n();

provide(key.heroHeight, ref(0));

const navLinks = computed(
  () =>
    [
      {
        name: t('nav.info'),
        links: [
          {
            name: 'Hvad er SMIL?',
            description: 'Generalt info om smil',
            to: 'INFO',
            icon: IconMdiInformationOutline,
          },
          {
            name: 'Udvidet åbningstid',
            description: '???',
            to: 'INFO',
            icon: IconMdiTimelapse,
          },
          {
            name: 'SMIL Aarhus',
            description: 'Historie om SMIL Aarhus',
            to: 'INFO',
            icon: IconMdiRestoreAlert,
          },
          {
            name: 'FAQ',
            description: 'Ofte stillede spørgsmål',
            to: 'INFO',
            icon: IconWpfFaq,
          },
          {
            name: 'Regler',
            description: 'God opførsel i SMIL',
            to: 'INFO',
            icon: IconMdiClipboardText,
          },
          {
            name: 'Lokaler',
            description: 'Billeder & info',
            to: 'INFO',
            icon: IconMdiFloorPlan,
          },
        ],
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
