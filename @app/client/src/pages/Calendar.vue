<template>
  <div>
    <ClientOnly>
      <MonthCalendar />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

useHead({
  title: computed(() => 'Calendar - SMil Aarhus'),
  meta: [
    {
      name: `description`,
      content: computed(() => ''),
    },
  ],
});
</script>
