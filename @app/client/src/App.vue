<template>
  <div w:bg="dark-500">
    <MemberBar v-if="store.currentMember" />
    <suspense><NavBar /></suspense>
    <router-view v-slot="{ Component, route }">
      <template v-if="Component">
        <transition mode="out-in">
          <div :key="route.name">
            <suspense>
              <component :is="Component"></component>
              <template #fallback>
                <div>Loading...</div>
              </template>
            </suspense>
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
