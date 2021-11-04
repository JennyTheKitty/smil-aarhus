<template>
  <div v-if="mobile"></div>
  <div v-else class="flex items-center">
    <Popover v-if="Object.prototype.hasOwnProperty.call(link, 'links')" v-slot="{ open }">
      <PopoverButton
        class="rounded-md cursor-pointer flex items-center group btn-focus-ring"
      >
        <span class="font-medium text-sm py-2 px-3 text-gray-300 hover:text-white">{{ link.name }}</span>
        <span
          class="mr-1 -ml-2 transform transition-transform text-gray-500 duration-200 group-hover:translate-y-0.5"
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
          class="rounded-xl bg-dark-900 border-gray-500 border-1 mt-3 grid py-3 px-2 transform left-1/2 z-5 grid-cols-2 -translate-x-1/2 absolute"
        >
          <router-link
            v-for="sublink in (link as Menu).links"
            :key="sublink.name"
            v-bind="sublink"
            class="rounded-md flex my-1 mx-3 py-2 px-2 group btn-focus-ring"
          >
            <component :is='sublink.icon' v-if='sublink.icon' class="-mt-0.5 mr-2 text-2xl" />
            <div class="flex flex-col">
              <span class="font-medium text-sm text-gray-300 group-hover:text-white">{{ sublink.name }}</span>
              <span class="font-light text-sm text-gray-200">{{ sublink.description }}</span>
            </div>
          </router-link>
        </PopoverPanel>
      </transition>
    </Popover>
    <router-link
      v-else
      v-bind="link"
      class="rounded-md font-medium text-sm py-2 px-3 text-gray-300 btn-focus-ring hover:text-white"
    >{{ link.name }}</router-link>
  </div>
</template>

<script setup lang="ts">
import { RouterLinkProps } from "vue-router";

type InnerLink = RouterLinkProps & { name: string };
type Menu = { name: string; links: Array<InnerLink & { description?: string; icon?: any }> }
export type Link =
  | InnerLink
  | Menu;

const props = defineProps<{
  link: Link,
  mobile: Boolean
}>();

</script>