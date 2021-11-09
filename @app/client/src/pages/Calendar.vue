<template>
  <div>
    <ClientOnly>
      <MonthCalendar />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

watch(
  () => route.params,
  () => console.log(route.params)
);
</script>
