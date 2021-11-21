import { RouteRecordRaw } from 'vue-router';

import Lang from './components/Lang.vue';
import { SUPPORTED_LANGUAGES, Trans } from './i18n';
import * as pages from './pages';

export enum Route {
  HOME = 'HOME',
  INFO = 'INFO',
  TEST = 'CALENDAR',
  GROUPS = 'GROUPS',
  NEWS = 'NEWS',
}

const i18nRoutes = {
  [Route.HOME]: {
    paths: { da: '', en: '' },
    component: pages.Home,
  },
  [Route.INFO]: {
    paths: { da: 'info', en: 'info' },
    component: pages.Info,
  },
  [Route.TEST]: {
    paths: { da: 'kalender/:slug?', en: 'calendar/:slug?' },
    component: pages.Calendar,
  },
  [Route.GROUPS]: {
    paths: { da: 'grupper/:slug?', en: 'groups/:slug?' },
    component: pages.Groups,
  },
  [Route.NEWS]: {
    paths: { da: 'nyheder/:slug?', en: 'news/:slug?' },
    component: pages.News,
  },
} as {
  [name in Route]: {
    paths: { [lang in typeof SUPPORTED_LANGUAGES[number]]: string };
  } & Omit<RouteRecordRaw, 'path' | 'name'>;
};

export const routes = [
  ...SUPPORTED_LANGUAGES.map((lang) => ({
    path: `/${lang}`,
    component: Lang,
    beforeEnter: Trans.routeMiddleware(lang),
    children: [
      ...Object.entries(i18nRoutes).map(([name, data]) => ({
        ...data,
        name: `${lang}-${name}`,
        path: data.paths[lang],
      })),
      {
        path: ':path(.+)+',
        component: pages.NotFound,
      },
    ],
  })),
  {
    path: '/:path(.+)*',
    redirect(route) {
      return '/' + Trans.getUserSupportedLang() + route.path;
    },
  },
] as RouteRecordRaw[];
