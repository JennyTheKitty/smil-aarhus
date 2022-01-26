<template>
  <div>
    <div v-if="!store.currentMember">
      <a
        href="#"
        w:text="gray-400"
        @click.stop.prevent="isLoginDialogOpen = true"
      >
        Admin login
      </a>
      <LoginDialog v-model:isOpen="isLoginDialogOpen" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../../store';
import { useWaitImportComponent } from '../../utils';

const isLoginDialogOpen = ref(false);
const LoginDialog = useWaitImportComponent(
  isLoginDialogOpen,
  () => import('./LoginDialog.vue')
);

const store = useStore();
</script>
