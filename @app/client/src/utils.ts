import { MaybeRef } from '@vueuse/core';
import { Ref } from 'vue';

import { FALLBACK_LANGUAGE } from './i18n';

export type Translateable = Record<string, unknown> & {
  translations: {
    nodes: (Record<string, unknown> & { languageCode: string })[];
  };
};

export type Translated<T extends Translateable> = Omit<
  Omit<T, 'translations'>,
  '__typename'
> &
  Omit<T['translations']['nodes'][number], '__typename'>;

export function useTranslation<T extends Translateable>(
  o: MaybeRef<undefined>,
  locale: Ref<string>
): null;
export function useTranslation<T extends Translateable>(
  o: MaybeRef<null>,
  locale: Ref<string>
): null;
export function useTranslation<T extends Translateable>(
  o: MaybeRef<T>,
  locale: Ref<string>
): Translated<T>;
export function useTranslation<T extends Translateable>(
  o: MaybeRef<T | null | undefined>,
  locale: Ref<string>
): Translated<T> | null;
export function useTranslation<T extends Translateable>(
  o: T | null | undefined,
  locale: Ref<string>
): Translated<T> | null {
  const obj = unref(o);
  if (obj === null || obj === undefined) return null;
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
}

export function useWaitImportComponent<X, T extends Promise<{ default: X }>>(
  until: Ref<boolean>,
  component: T
): Ref<null | X> {
  let val: Ref<null | X> = ref(null);

  watch(until, async () => {
    val.value = (await component).default;
  });
  return val;
}
