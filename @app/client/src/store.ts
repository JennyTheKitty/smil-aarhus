import { GetMeQuery } from '@app/graphql/dist/client';
import { createGlobalState, useSessionStorage } from '@vueuse/core';

export const useGlobalState = createGlobalState(() =>
  useSessionStorage('smil-aarhus', {
    currentMember: null as GetMeQuery['currentMember'],
  })
);
