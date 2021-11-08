import { MaybeRef } from '@vueuse/core';
import { Ref } from 'vue';

import { FALLBACK_LANGUAGE } from './i18n';

export type Translateable = Record<string, unknown> & {
  translations: {
    nodes: (Record<string, unknown> & { languageCode: string })[];
  };
};

export type Translated<T extends Translateable> = Ref<
  | (Omit<Omit<T, 'translations'>, '__typename'> &
      Omit<T['translations']['nodes'][number], '__typename'>)
  | null
>;

export function useTranslation<T extends Translateable>(
  o: MaybeRef<T | null>,
  locale: Ref<string>
): Translated<T> {
  return computed(() => {
    const obj = unref(o);
    if (obj === null) return null;
    const {
      translations: { nodes },
      ...rest
    } = obj;
    let translation: T['translations']['nodes'][number] | undefined;
    for (const l of [locale.value, FALLBACK_LANGUAGE]) {
      translation = nodes.find((node) => node.languageCode.toLowerCase() === l);
      if (translation !== undefined) break;
    }
    if (translation === undefined) translation = nodes[0];

    return {
      ...rest,
      ...translation,
    };
  });
}
