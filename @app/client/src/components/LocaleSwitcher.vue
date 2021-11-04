<template>
  <Menu as="div" class="text-left relative inline-block">
    <div>
      <MenuButton
        class="rounded-md font-medium space-x-2 text-sm py-2 px-3 text-gray-300 hidden items-center btn-focus-ring md:flex hover:text-white"
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
        class="rounded-xl bg-dark-900 border-gray-500 border-1 shadow-lg mt-2 origin-top-right right-0 w-42 z-5 absolute focus:outline-none"
      >
        <div class="py-1 px-1">
          <MenuItem v-for="{ text, icons }, lang in locales" v-slot="{ active }" :key="text">
            <button
              :class="[
                active ? 'bg-pink-900' : '',
                'group flex rounded-md items-center w-full px-2 py-2 text-sm text-white',
              ]"
              @click="switchLocale(lang)"
            >
              {{ text }}
              <div class="flex-grow"></div>
              <component :is="icon" v-for="icon, i in icons" :key="i" />
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Lang, Trans } from '../i18n'

const router = useRouter()
const { locale } = useI18n();

const locales = {
  en: {
    text: 'English',
    icons: [
      IconEmojioneFlagForUnitedKingdom,
      IconEmojioneFlagForUnitedStates,
    ]
  },
  da: {
    text: 'Dansk',
    icons: [IconEmojioneFlagForDenmark]
  }
} as const;

async function switchLocale(lang: Lang) {
  const to = router.resolve({ params: { lang } })
  await Trans.changeLanguage(lang);
  await router.push(to);
}

</script>
