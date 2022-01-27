<template>
  <div v-if="mobile">
    <div v-if="Object.prototype.hasOwnProperty.call(link, 'links')">
      <span w:text="lg gray-500">{{ link.name }}</span>
      <i18n-link
        v-for="sublink in (link as LinkMenu).links"
        :key="sublink.name"
        :to="sublink.to"
        :params="sublink.params"
        w:rounded="md"
        w:flex="~"
        w:m="y-1"
        w:p="2"
        class="group btn-focus-ring"
      >
        <ClientOnly>
          <span
            v-if="sublink.icon"
            class="iconify"
            :data-icon="sublink.icon"
            w:text="3xl"
            w:m="r-2"
          ></span>
        </ClientOnly>
        <div w:flex="~ col">
          <span w:font="medium" w:text="sm gray-300 group-hover:white">{{
            sublink.name
          }}</span>
          <span w:font="light" w:text="sm gray-200">{{
            sublink.description
          }}</span>
        </div>
      </i18n-link>
    </div>
    <i18n-link
      v-else
      :to="(link as InnerLink).to"
      :params="(link as InnerLink).params"
      w:rounded="md"
      w:font="medium"
      w:text="lg gray-300 hover:white"
      w:p="y-2"
      w:m="y-2"
      w:display="block"
      class="btn-focus-ring"
      >{{ link.name }}</i18n-link
    >
  </div>
  <div v-else w:flex="~" w:align="items-center">
    <Popover
      v-if="Object.prototype.hasOwnProperty.call(link, 'links')"
      v-slot="{ open, close }"
    >
      <PopoverButton
        w:rounded="md"
        w:cursor="pointer"
        w:flex="~"
        w:align="items-center"
        class="group btn-focus-ring"
      >
        <span
          w:font="medium"
          w:text="base gray-300 hover:white"
          w:p="y-2 x-3"
          >{{ link.name }}</span
        >
        <span
          w:m="r-1 -2-2"
          w:transform="~ group-hover:translate-y-0.5"
          w:transition="transform duration-200"
          w:text="gray-500"
        >
          <icon-mdi-chevron-up v-if="open" />
          <icon-mdi-chevron-down v-else />
        </span>
      </PopoverButton>
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <PopoverPanel
          w:rounded="xl"
          w:bg="dark-900"
          w:border="2 pink-800"
          :w:grid="`~ ${(link as LinkMenu).singleColumn ? 'cols-1' : 'cols-2'}`"
          w:pos="absolute left-1/2"
          w:m="t-3"
          w:p="y-3 x-2"
          w:z="5"
          w:transform="~ -translate-x-1/2"
        >
          <i18n-link
            v-for="sublink in (link as LinkMenu).links"
            :key="sublink.name"
            :to="sublink.to"
            :params="sublink.params"
            @click="close"
            w:rounded="md"
            w:flex="~"
            w:m="y-1 x-3"
            w:p="2"
            class="group btn-focus-ring"
          >
            <ClientOnly>
              <span
                v-if="sublink.icon"
                class="iconify"
                :data-icon="sublink.icon"
                w:text="3xl"
                w:m="r-2"
              ></span>
            </ClientOnly>
            <div w:flex="~ col">
              <span w:font="medium" w:text="sm gray-300 group-hover:white">{{
                sublink.name
              }}</span>
              <span w:font="light" w:text="sm gray-200">{{
                sublink.description
              }}</span>
            </div>
          </i18n-link>
        </PopoverPanel>
      </transition>
    </Popover>
    <i18n-link
      v-else
      :to="(link as InnerLink).to"
      :params="(link as InnerLink).params"
      w:rounded="md"
      w:font="medium"
      w:text="base gray-300 hover:white"
      w:p="y-2 x-3"
      class="btn-focus-ring"
      >{{ link.name }}</i18n-link
    >
  </div>
</template>

<script setup lang="ts">
import type { Link, InnerLink, LinkMenu } from './Link';

defineProps<{
  link: Link;
  mobile: Boolean;
}>();
</script>
