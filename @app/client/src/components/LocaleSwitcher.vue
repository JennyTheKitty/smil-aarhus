<template>
  <Menu as="div" w:text="left" w:pos="relative">
    <div>
      <MenuButton
        w:rounded="md"
        w:font="medium"
        w:space="x-2"
        w:text="sm gray-300 hover:white"
        w:p="y-2 x-3"
        w:display="hidden md:flex"
        w:align="center"
        class="btn-focus-ring"
      >
        <span>{{ locales[locale].text }}</span>
        <icon-mdi-translate />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        w:rounded="xl"
        w:bg="dark-900"
        w:border="1 gray-500"
        w:shadow="lg"
        w:m="t-2"
        w:transform="origin-top-right"
        w:z="5"
        w:w="42"
        w:pos="absolute right-0"
        w:outline="focus:none"
      >
        <div w:p="1">
          <MenuItem
            v-for="({ text, icons }, lang) in locales"
            v-slot="{ active }"
            :key="text"
          >
            <button
              :w:bg="active ? 'pink-900' : ''"
              w:flex="~"
              w:rounded="md"
              w:align="items-center"
              w:w="full"
              w:p="2"
              w:text="sm white"
              @click="switchLocale(lang)"
            >
              {{ text }}
              <div w:flex="grow"></div>
              <component :is="icon" v-for="(icon, i) in icons" :key="i" />
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Lang, Trans } from '../i18n';

const router = useRouter();
const { locale } = useI18n();

const locales = {
  en: {
    text: 'English',
    icons: [IconEmojioneFlagForUnitedKingdom, IconEmojioneFlagForUnitedStates],
  },
  da: {
    text: 'Dansk',
    icons: [IconEmojioneFlagForDenmark],
  },
} as const;

async function switchLocale(lang: Lang) {
  const to = router.resolve({ params: { lang } });
  await Trans.changeLanguage(lang);
  await router.push(to);
}
</script>
