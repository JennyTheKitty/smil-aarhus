import 'dayjs/locale/da';

import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { createI18n } from 'petite-vue-i18n';
import { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';

import da from './lang/da.json';

dayjs.extend(LocalizedFormat);

const SUPPORTED_LANGUAGES = ['da', 'en'] as const;
const DEFAULT_LANGUAGE = 'da';
export const FALLBACK_LANGUAGE = 'da';

export type Lang = typeof SUPPORTED_LANGUAGES[number];

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
    const userPreferredLang = Trans.getUserLang();

    // Check if user preferred browser lang is supported
    if (Trans.isLangSupported(userPreferredLang.lang as Lang)) {
      return userPreferredLang.lang;
    }
    // Check if user preferred lang without the ISO is supported
    if (Trans.isLangSupported(userPreferredLang.langNoISO as Lang)) {
      return userPreferredLang.langNoISO;
    }
    return Trans.defaultLanguage;
  },

  getUserLang() {
    //(window && window.navigator.language) ||
    const lang = Trans.defaultLanguage;
    return {
      lang: lang,
      langNoISO: lang.split('-')[0],
    };
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

  async routeMiddleware(to: RouteLocationNormalized) {
    const lang = to.params.lang as Lang;
    if (!Trans.isLangSupported(lang)) return Trans.getUserSupportedLang();
    await Trans.changeLanguage(lang);
    return true;
  },

  i18nRoute(to: RouteLocationRaw, lang: Lang | null = null): RouteLocationRaw {
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    if (lang === null) lang = i18n.global.locale.value;
    if (typeof to === 'string') {
      return {
        path: to,
        params: { lang },
      };
    }
    return {
      ...to,
      params: {
        lang,
        ...('params' in to ? to.params : {}),
      },
    };
  },
};
