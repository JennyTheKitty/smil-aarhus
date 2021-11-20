<template>
  <nav
    id="nav"
    w:bg="dark-900"
    w:text="gray-300"
    w:z="5"
    w:pos="md:sticky top-0"
    w:transition="~ background-color duration-50"
  >
    <ExpandTransition>
      <div
        v-show="menuOpen"
        id="nav-menu"
        w:w="full"
        w:display="md:hidden"
        w:z="4"
        w:pos="absolute top-0"
      >
        <div
          w:space="y-1"
          w:p="x-5 b-3 t-20"
          w:bg="dark-900 opacity-100"
          w:pos="relative -top-2"
          w:w="95vw"
          w:m="x-auto"
        >
          <div v-for="link in links" :key="link.name">
            <NavLink :link="link" :mobile="true" />
          </div>
        </div>
      </div>
    </ExpandTransition>
    <div w:m="auto" w:max-w="7xl" w:p="x-2 md:x-8" w:z="10" w:pos="relative">
      <div w:flex="~" w:h="16" w:align="items-center" w:justify="between">
        <div
          w:w="full"
          w:grid="~"
          w:justify="center"
          w:align="items-center"
          class="grid-cols-[1fr,auto,1fr]"
        >
          <router-link
            w:rounded="md"
            w:flex="~"
            w:font="medium"
            w:h="14"
            w:p="x-2"
            w:text="gray hover:white"
            w:justify="self-start"
            w:align="items-center"
            class="btn-focus-ring"
            :to="i18nRoute({ name: 'home' })"
            :title="t('nav.home')"
          >
            <icon-smil-logo-aarhus w:text="7xl" />
          </router-link>
          <PopoverGroup
            w:space="x-4"
            w:m="l-10"
            w:display="hidden md:flex"
            w:align="items-center"
          >
            <div v-for="link in links" :key="link.name">
              <NavLink :link="link" :mobile="false" />
            </div>
          </PopoverGroup>
          <LocaleSwitcher w:justify="self-end" />
        </div>
        <div
          w:display="inline-flex md:hidden"
          w:m="r-2 -l-8"
          w:p="2"
          w:text="3xl white"
          w:align="items-center"
          w:justify="center"
        >
          <NavMenuButton v-model="menuOpen" />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { Link } from './NavLink.vue';

defineProps<{
  links: Array<Link>;
}>();

const menuOpen = ref(false);

const { t } = useI18n();
const route = useRoute();
const i18nRoute = inject(key.i18nRoute)!;

const heroHeight = inject(key.heroHeight);
const { y: windowY } = useWindowScroll();
const bgOpacity = computed(() => {
  if (route.name === 'home') {
    if (heroHeight?.value && !menuOpen.value)
      return Math.min(0.9, windowY.value / heroHeight.value);
    return 0.0;
  }
  return 1.0;
});
</script>

<style>
#nav {
  --tw-bg-opacity: v-bind(bgOpacity);
}
</style>
