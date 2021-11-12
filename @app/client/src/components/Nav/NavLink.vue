<template>
  <div v-if="mobile"></div>
  <div v-else w:flex="~" w:align="items-center">
    <Popover
      v-if="Object.prototype.hasOwnProperty.call(link, 'links')"
      v-slot="{ open }"
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
          w:grid="~ cols-2"
          w:pos="absolute left-1/2"
          w:m="t-3"
          w:p="y-3 x-2"
          w:z="5"
          w:transform="~ -translate-x-1/2"
        >
          <router-link
            v-for="sublink in (link as Menu).links"
            :key="sublink.name"
            v-bind="sublink"
            w:rounded="md"
            w:flex="~"
            w:m="y-1 x-3"
            w:p="2"
            class="group btn-focus-ring"
          >
            <component
              :is="sublink.icon"
              v-if="sublink.icon"
              w:text="2xl"
              w:m="-t-0.5 r-2"
            />
            <div w:flex="~ col">
              <span w:font="medium" w:text="sm gray-300 group-hover:white">{{
                sublink.name
              }}</span>
              <span w:font="light" w:text="sm gray-200">{{
                sublink.description
              }}</span>
            </div>
          </router-link>
        </PopoverPanel>
      </transition>
    </Popover>
    <router-link
      v-else
      v-bind="link"
      w:rounded="md"
      w:font="medium"
      w:text="base gray-300 hover:white"
      w:p="y-2 x-3"
      class="btn-focus-ring"
      >{{ link.name }}</router-link
    >
  </div>
</template>

<script setup lang="ts">
import { RouterLinkProps } from 'vue-router';

type InnerLink = RouterLinkProps & { name: string };
type Menu = {
  name: string;
  links: Array<InnerLink & { description?: string; icon?: any }>;
};
export type Link = InnerLink | Menu;

defineProps<{
  link: Link;
  mobile: Boolean;
}>();
</script>
