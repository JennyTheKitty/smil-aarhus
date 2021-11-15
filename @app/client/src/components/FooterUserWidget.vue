<template>
  <div>
    <div v-if="state.currentMember" w:flex="~ col">
      <span w:text="gray-500">Logged in as:</span>
      <span>
        {{ state.currentMember.name }} ({{ state.currentMember.userRole }})
      </span>
      <a href="#" w:text="gray-500" @click.stop.prevent="logout">Logout</a>
    </div>
    <div v-else>
      <a
        href="#"
        w:text="gray-500"
        @click.stop.prevent="isLoginDialogOpen = true"
      >
        Admin login
      </a>
      <LoginDialog v-model:isOpen="isLoginDialogOpen" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { GetMeDocument, LogoutDocument } from '@app/graphql/dist/client';

import { accessToken } from '../accessToken';
import { useGlobalState } from '../store';

const isLoginDialogOpen = ref(false);
const LoginDialog = defineAsyncComponent(async () => {
  await until(isLoginDialogOpen).toBe(true);
  return await import('./LoginDialog.vue');
});

const { data } = useQuery({
  query: GetMeDocument,
});

const state = useGlobalState();

watch(data, () => {
  state.value.currentMember = data.value?.currentMember || null;
});

const { executeMutation } = useMutation(LogoutDocument);

function logout() {
  accessToken.value = '';
  executeMutation({});
}
</script>
