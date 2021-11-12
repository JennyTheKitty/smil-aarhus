import { InjectionKey, Ref } from 'vue';

import { Trans } from './i18n';

const i18nRoute: InjectionKey<typeof Trans.i18nRoute> = Symbol('i18nRoute');

const heroHeight: InjectionKey<Ref<number>> = Symbol('heroHeight');

export const key = {
  i18nRoute,
  heroHeight,
} as const;
