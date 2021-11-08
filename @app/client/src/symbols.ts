import { InjectionKey } from 'vue';

import { Trans } from './i18n';

const i18nRoute: InjectionKey<typeof Trans.i18nRoute> = Symbol('i18nRoute');

export const key = {
  i18nRoute,
} as const;
