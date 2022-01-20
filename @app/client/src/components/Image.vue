<template>
  <picture>
    <source :srcset="image.srcSetWebp" type="image/webp" :sizes="sizes" />
    <source :srcset="image.srcSetJpeg" type="image/jpeg" :sizes="sizes" />
    <img
      :src="image.src"
      v-bind="$attrs"
      :height="image.height"
      :width="image.width"
      :loading="loading"
      :alt="alt"
    />
  </picture>
</template>

<script setup lang="ts">
import { ResponsiveImage } from '@app/graphql/dist/client';
import { PropType } from 'vue-demi';

defineProps({
  image: { type: Object as PropType<ResponsiveImage>, required: true },
  sizes: { type: String, required: true },
  alt: { type: String, required: true },
  loading: { type: String, default: () => 'lazy' },
});
</script>
