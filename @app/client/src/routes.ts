import { RouteRecordRaw } from 'vue-router';

import Lang from './components/Lang.vue';
import { Trans } from './i18n';
import * as pages from './pages';

export default [
  {
    path: '/:lang(da|en)',
    component: Lang,
    beforeEnter: Trans.routeMiddleware,
    children: [
      {
        path: '',
        name: 'home',
        component: pages.Home,
      },
      {
        path: 'info',
        name: 'info',
        component: pages.Info,
      },
      {
        path: 'calendar/:eventSlug?',
        name: 'calendar',
        component: pages.Calendar,
      },
      {
        path: 'news/:newsSlug?',
        name: 'news',
        component: pages.News,
      },

      {
        path: ':path(.+)+',
        component: pages.NotFound,
      },
    ],
  },
  {
    path: '/:path(.+)*',
    redirect(route) {
      return '/' + Trans.getUserSupportedLang() + route.path;
    },
  },
] as RouteRecordRaw[];
