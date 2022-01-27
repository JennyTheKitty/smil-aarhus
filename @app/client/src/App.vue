<template>
  <div w:bg="dark-500">
    <MemberBar v-if="store.currentMember" />
    <suspense><NavBar /></suspense>
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
            <!-- <keep-alive> -->
            <component :is="Component"></component>
            <!-- </keep-alive> -->
          </div>
        </transition>
      </template>
    </router-view>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useStore } from './store';

provide(key.heroHeight, ref(0));

const store = useStore();
</script>
