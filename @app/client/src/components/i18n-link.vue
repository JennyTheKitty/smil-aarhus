<template>
  <router-link v-bind="{ ...$attrs, ...$props }" :to="to">
    <slot />
  </router-link>
</template>

<script setup lang="ts">
/* eslint-disable vue/require-default-prop */
import { RouteParamsRaw, RouterLinkProps } from 'vue-router';

import { Trans } from '../i18n';
import { Route } from '../routes';

interface Props {
  to: `${Route}`;
  params?: RouteParamsRaw;
  replace?: boolean;
  activeClass?: string;
  exactActiveClass?: string;
  custom?: boolean;
  ariaCurrentValue?: RouterLinkProps['ariaCurrentValue'];
}

const props = withDefaults(defineProps<Props>(), { ariaCurrentValue: 'page' });

const to = computed(() => {
  return Trans.i18nRoute(props.to, props.params);
});
</script>
