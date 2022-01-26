import { RouteParamsRaw } from 'vue-router';

import { Route } from '../../routes';

export type InnerLink = {
  to: `${Route}`;
  params?: RouteParamsRaw;
  name: string;
};
export type LinkMenu = {
  name: string;
  links: Array<InnerLink & { description?: string; icon?: any }>;
  singleColumn: boolean;
};
export type Link = InnerLink | LinkMenu;
