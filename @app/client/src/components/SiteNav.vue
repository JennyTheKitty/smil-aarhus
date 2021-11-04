<template>
  <nav class="bg-dark-900 shadow text-gray-300">
    <div class="mx-auto max-w-7xl px-2 md:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="w-full grid grid-cols-[1fr,auto,1fr] justify-center items-center">
          <router-link
            class="rounded-md flex font-medium h-14 px-2 text-gray-300 justify-self-start items-center btn-focus-ring hover:text-white"
            :to="i18nRoute({ name: 'home' })"
            :title="t('nav.home')"
          >
            <icon-smil-logo-aarhus class="text-7xl" />
          </router-link>
          <PopoverGroup class="space-x-4 ml-10 hidden items-center md:flex">
            <div v-for="link in props.links" :key="link.name">
              <SiteNavLink :link="link" :mobile="false" />
            </div>
          </PopoverGroup>
          <LocaleSwitcher class="justify-self-end" />
        </div>
        <div
          class="rounded-md flex mr-2 -ml-8 p-2 text-3xl inline-flex items-center justify-center md:hidden hover:text-gray-300 focus:outline-none"
        >
          <NavToggleButton v-model="menuOpen" />
        </div>
      </div>
    </div>
    <ExpandTransition>
      <div v-show="menuOpen" class="md:hidden">
        <div class="space-y-1 px-2 pb-3 sm:px-3">
          <div v-for="link in props.links" :key="link.name">
            <SiteNavLink :link="link" :mobile="true" />
          </div>
        </div>
      </div>
    </ExpandTransition>
  </nav>
</template>

<script setup lang="ts">
import type { Link } from './SiteNavLink.vue';

const props = defineProps<{
  links: Array<Link>;
}>();

const menuOpen = ref(false);

const { t } = useI18n();

const i18nRoute = inject(key.i18nRoute)!;
</script>
