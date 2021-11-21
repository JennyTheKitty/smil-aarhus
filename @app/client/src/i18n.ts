import 'dayjs/locale/da';

import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { createI18n } from 'petite-vue-i18n';
import { ComputedRef } from 'vue';
import { RouteLocationRaw, RouteParamsRaw } from 'vue-router';

import da from './lang/da.json';
import { Route } from './routes';

dayjs.extend(LocalizedFormat);

export const SUPPORTED_LANGUAGES = ['da', 'en'] as const;
const DEFAULT_LANGUAGE = 'da';
export const FALLBACK_LANGUAGE = 'da';

export type Lang = typeof SUPPORTED_LANGUAGES[number];

export const userLangs = ref<{ lang: string; langNoISO: string }[]>([]);

export const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LANGUAGE,
  fallbackLocale: FALLBACK_LANGUAGE,
  messages: { da },
});

export const Trans = {
  get defaultLanguage() {
    return DEFAULT_LANGUAGE;
  },
  get supportedLanguages() {
    return SUPPORTED_LANGUAGES;
  },

  getUserSupportedLang() {
    for (const userLang of userLangs.value) {
      // Check if user preferred browser lang is supported
      if (Trans.isLangSupported(userLang.lang as Lang)) {
        return userLang.lang;
      }
      // Check if user preferred lang without the ISO is supported
      if (Trans.isLangSupported(userLang.langNoISO as Lang)) {
        return userLang.langNoISO;
      }
    }

    return Trans.defaultLanguage;
  },

  setI18nLanguageInServices(lang: string) {
    return lang;
  },

  changeLanguage(lang: Lang): Promise<string> {
    if (!Trans.isLangSupported(lang))
      return Promise.reject(new Error('Language not supported'));
    if (i18n.global.locale === lang) return Promise.resolve(lang); // has been loaded prior
    return Trans.loadLanguageFile(lang).then((msgs) => {
      i18n.global.setLocaleMessage(lang, msgs.default || msgs);
      dayjs.locale(lang);
      // TODO: Report as bug?
      // @ts-ignore
      i18n.global.locale.value = lang;
      // document.querySelector("html")!.setAttribute("lang", lang);
      return lang;
    });
  },

  loadLanguageFile(lang: string) {
    return import(`./lang/${lang}.json`);
  },

  isLangSupported(lang: Lang) {
    return Trans.supportedLanguages.includes(lang);
  },

  routeMiddleware(lang: Lang) {
    return async () => {
      await Trans.changeLanguage(lang);
      return true;
    };
  },

  i18nRoute(name: `${Route}`, params?: RouteParamsRaw): RouteLocationRaw {
    return {
      name:
        (i18n.global.locale as unknown as ComputedRef<string>).value +
        '-' +
        name,
      params: params || undefined,
    };
  },
};
