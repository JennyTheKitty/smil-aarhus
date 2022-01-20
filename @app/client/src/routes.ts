import { RouteRecordRaw } from 'vue-router';

import Lang from './components/Lang.vue';
import { SUPPORTED_LANGUAGES, Trans } from './i18n';

import Home from './pages/Home.vue';

export enum Route {
  HOME = 'HOME',
  INFO = 'INFO',
  CALENDAR = 'CALENDAR',
  PICTURES = 'PICTURES',
  GROUPS = 'GROUPS',
  GROUP = 'GROUP',
  NEWS = 'NEWS',
}

const i18nRoutes = {
  [Route.HOME]: {
    paths: { da: '', en: '' },
    component: Home,
  },
  [Route.INFO]: {
    paths: { da: 'info', en: 'info' },
    component: () => import('./pages/Info.vue'),
  },
  [Route.CALENDAR]: {
    paths: { da: 'kalender/:slug?', en: 'calendar/:slug?' },
    component: () => import('./pages/Calendar.vue'),
  },
  [Route.PICTURES]: {
    paths: { da: 'billeder', en: 'pictures' },
    component: () => import('./pages/Pictures.vue'),
  },
  [Route.GROUPS]: {
    paths: { da: 'grupper', en: 'groups' },
    component: () => import('./pages/Groups.vue'),
  },
  [Route.GROUP]: {
    paths: { da: 'grupper/:slug', en: 'groups/:slug' },
    component: () => import('./pages/Group.vue'),
  },
  [Route.NEWS]: {
    paths: { da: 'nyheder/:slug?', en: 'news/:slug?' },
    component: () => import('./pages/News.vue'),
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
        component: () => import('./pages/NotFound.vue'),
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
