import { GetMeDocument, GetMeQuery } from '@app/graphql/dist/client';
import { useClientHandle } from '@urql/vue';
import { defineStore } from 'pinia';

import { accessToken } from './accessToken';

export const useStore = defineStore('main', {
  state: () => {
    const handle = useClientHandle();

    if (!import.meta.env.SSR) {
      watch(
        accessToken,
        async (accessToken) => {
          const store = useStore();
          if (accessToken) {
            const { data } = await handle.client
              .query(GetMeDocument)
              .toPromise();
            store.currentMember = data?.currentMember || null;
          } else {
            store.currentMember = null;
          }
        },
        { immediate: true }
      );
    }

    return {
      currentMember: null as GetMeQuery['currentMember'],
    };
  },
});
