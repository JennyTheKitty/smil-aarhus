<template>
  <div ref="hero" class="hero" w:h="full" w:pos="relative" w:m="-t-16">
    <picture>
      <source :srcset="jpeg" type="image/jpeg" sizes="100vw" />
      <source :srcset="webp" type="image/webp" sizes="100vw" />
      <img
        alt=""
        class="hero"
        w:object="cover"
        w:w="full"
        w:max-h="50vh"
        w:filter="~ brightness-75"
        v-bind="metadata"
        :style="imgStyles"
      />
    </picture>
    <div
      w:flex="~ col"
      w:h="full"
      w:w="full"
      w:pos="top-0 absolute"
      w:align="items-center"
      w:justify="center"
      w:p="4 t-12 md:t-4"
      w:space="y-1 sm:y-5"
      w:text="white center"
      w:border="b-4 b-pink-800"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  webp: string;
  jpeg: string;
  metadata: any;
  brightness: number;
}

const props = defineProps<Props>();

const hero = ref(null);

const { height } = useElementSize(hero);
const heroHeight = inject(key.heroHeight);
watch(height, () => {
  heroHeight!.value = height.value;
});

const imgStyles = computed(() => ({
  '--tw-brightness': `brightness(${props.brightness}%)`,
})) as any;
</script>

<style scoped>
.hero {
  max-height: max(calc(64px + 50vh), 500px);
}
</style>
