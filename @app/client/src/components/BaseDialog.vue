<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog :open="isOpen" @close="$emit('update:isOpen', false)">
      <div
        w:pos="fixed inset-0"
        w:z="10"
        w:flex="~ col"
        w:align="items-center"
        w:justify="center"
      >
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay w:pos="inset-0 fixed" w:bg="black opacity-50" />
        </TransitionChild>
        <TransitionChild
          as="div"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <slot></slot>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();
defineEmits(['update:isOpen']);
</script>
