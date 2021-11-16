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
import { Trans } from './i18n';

const { t } = useI18n();

provide(key.heroHeight, ref(0));

const navLinks = computed(() => [
  // {
  //   name: 'Home',
  //   to: '/'
  // },
  {
    name: t('nav.info'),
    links: [
      {
        name: 'Hvad er SMIL?',
        description: 'Generalt info om smil',
        to: '/info/hvad-er-smil',
        icon: IconMdiInformationOutline,
      },
      {
        name: 'Udvidet åbningstid',
        description: '???',
        to: '/info/udvidet-åbningstid',
        icon: IconMdiTimelapse,
      },
      {
        name: 'SMIL Aarhus',
        description: 'Historie om SMIL Aarhus',
        to: '/info/smil-aarhus',
        icon: IconMdiRestoreAlert,
      },
      {
        name: 'FAQ',
        description: 'Ofte stillede spørgsmål',
        to: '/info/faq',
        icon: IconWpfFaq,
      },
      {
        name: 'Regler',
        description: 'God opførsel i SMIL',
        to: '/info/regler',
        icon: IconMdiClipboardText,
      },
      {
        name: 'Lokaler',
        description: 'Billeder & info',
        to: '/info/lokaler',
        icon: IconMdiFloorPlan,
      },
      // {
      //   name: 'Konakt',
      //   description: 'Kontakt SMIL Aarhus',
      //   to: '/kontakt',
      //   icon: IconMdiMailRu
      // },
      // {
      //   name: 'FetLife',
      //   description: 'Find os på FetLife',
      //   to: '/fetlife',
      //   icon: IconSmilFetlife
      // }
    ],
  },
  {
    name: t('nav.groups'),
    links: [
      { name: 'Alle grupper', to: '/grupper' },
      { name: 'Rebhygge', to: '/grupper/rebhygge' },
      { name: 'Domini Noctis', to: '/grupper/domini-noctis' },
      { name: 'Kink Youth', to: '/grupper/kink-youth' },
      { name: 'Frivilliggruppen', to: '/grupper/frivillig' },
      { name: 'Kink Academy', to: '/grupper/kink-academy' },
      { name: 'Peer Whip', to: '/grupper/peer-whip' },
    ],
  },
  {
    name: t('nav.calendar'),
    to: Trans.i18nRoute({ name: 'calendar' }),
  },
  {
    name: t('nav.news'),
    to: Trans.i18nRoute({ name: 'news' }),
  },
]);
</script>
