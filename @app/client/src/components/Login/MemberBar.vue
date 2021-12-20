<template>
  <div
    w:bg="dark-900"
    w:w="full"
    w:h="10"
    w:flex="~ col"
    w:justify="center"
    w:align="items-center"
    w:border="b-pink-800 b-2"
  >
    <div
      w:max-w="5xl"
      w:text="true-gray-100"
      w:grid="~ cols-3"
      w:w="full"
      w:align="items-center"
    >
      <div id="member-bar-left"></div>
      <div w:justify="self-center">
        <span w:text="true-gray-500 space-nowrap">{{ t('logged-in-as') }}</span>
        {{ ' ' }}
        <span w:font="bold" w:text="space-nowrap">{{
          store.currentMember?.name
        }}</span>
      </div>
      <div w:justify="self-end">
        <button @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LogoutDocument } from '@app/graphql/dist/client';

import { accessToken } from '../../accessToken';
import { useStore } from '../../store';

const store = useStore();
const { t } = useI18n();

const { executeMutation } = useMutation(LogoutDocument);

function logout() {
  accessToken.value = '';
  executeMutation({});
}
</script>
