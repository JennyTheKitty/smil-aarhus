import {
  CreateImageMutationDocument,
  CreateImageMutationMutation,
  GetUploadUrlDocument,
  TrLanguage,
} from '@app/graphql/dist/client';
import { ClientHandle } from '@urql/vue';
import { MaybeRef } from '@vueuse/core';
import { InjectionKey, Ref } from 'vue';

import { FALLBACK_LANGUAGE } from './i18n';

export type Translateable = Record<string, unknown> & {
  translations: (Record<string, unknown> & { languageCode: string })[];
};

export type Translated<T extends Translateable> = Omit<
  Omit<T, 'translations'>,
  '__typename'
> &
  Omit<T['translations'][number], '__typename'>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useTranslation<T extends Translateable>(
  o: MaybeRef<undefined>,
  locale: Ref<string>
): null;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const { translations, ...rest } = obj;
  let translation: T['translations'][number] | undefined;
  for (const l of [locale.value, FALLBACK_LANGUAGE]) {
    translation = translations.find(
      (node) => node.languageCode.toLowerCase() === l
    );
    if (translation !== undefined) break;
  }
  if (translation === undefined) translation = translations[0];

  return {
    ...rest,
    ...translation,
  };
}

export function useWaitImportComponent<
  X,
  T extends () => Promise<{ default: X }>
>(until: Ref<boolean>, component: T): Ref<(() => null) | X> {
  let val: Ref<(() => null) | X> = ref(() => null);

  watch(until, async () => {
    val.value = markRaw((await component()).default as any);
  });
  return val;
}

const heroHeight: InjectionKey<Ref<number>> = Symbol('heroHeight');
const formDialogCurrentLanguageCode: InjectionKey<Ref<TrLanguage>> = Symbol(
  'formDialogCurrentLanguageCode'
);

export const key = {
  heroHeight,
  formDialogCurrentLanguageCode,
} as const;

export interface UploadInfo {
  url: string;
  data: FormData;
}

export async function getUploadUrl(
  handle: ClientHandle,
  fileType: string
): Promise<UploadInfo> {
  const { data } = await handle.client
    .mutation(GetUploadUrlDocument, {
      contentType: fileType,
      randomId: Math.random().toString(),
    })
    .toPromise();
  if (!data || !data.createUploadUrl) throw new Error('Get upload url failed.');
  const formData = new FormData();
  console.log(data);
  for (const [key, val] of Object.entries(
    JSON.parse(data.createUploadUrl.formData) as { [key: string]: string }
  )) {
    formData.append(key, val);
  }
  return { url: data.createUploadUrl.uploadUrl, data: formData };
}

export async function uploadFile(
  file: File,
  info: UploadInfo,
  progressCallback: (percent: number) => void
): Promise<string> {
  info.data.append('file', file);
  const axios = (await import('axios')).default;
  const res = await axios.post(info.url, info.data, {
    onUploadProgress: (e: ProgressEvent) =>
      progressCallback(e.loaded / e.total),
  });
  return new URL(res.headers.location).pathname.split('/').slice(2).join('/');
}

export function getImageFileDimentions(
  file: File
): Promise<{ height: number; width: number }> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.addEventListener('load', () => {
      resolve({ height: img.height, width: img.width });
      URL.revokeObjectURL(objectUrl);
    });
    img.src = objectUrl;
  });
}

type CreateImageReturn<T> = T extends false
  ? NonNullable<
      NonNullable<CreateImageMutationMutation['createImage']>['image']
    >
  : T extends true
  ? number
  : never;

export async function createImage<B extends boolean>(
  handle: ClientHandle,
  file: File,
  progressCallback: (percent: number) => void,
  onlyId: B
): Promise<CreateImageReturn<B>> {
  const { height, width } = await getImageFileDimentions(file);
  const info = await getUploadUrl(handle, file.type);
  const url = await uploadFile(file, info, progressCallback);
  const { data } = await handle.client
    .mutation(CreateImageMutationDocument, {
      path: url,
      height,
      width,
      onlyId,
    })
    .toPromise();
  if (!data?.createImage?.image) throw new Error('Could not create image');
  return onlyId ? data.createImage.image.id : data.createImage.image;
}
