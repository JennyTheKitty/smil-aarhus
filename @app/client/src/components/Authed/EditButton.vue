<template>
  <button
    v-if="!editing || (editing && !save)"
    w:rounded="md"
    w:font="medium"
    w:space="x-2"
    w:text="sm gray-300 hover:white"
    w:p="y-2 x-3"
    w:display="flex"
    w:align="center"
    class="btn-focus-ring"
    @click="emit('update:editing', !editing)"
  >
    <span>
      {{ editing ? t('stop-editing') : t('edit') }}
    </span>
    <icon-mdi-pencil />
  </button>
  <div v-if="editing && save" w:flex="~" w:space="x-2">
    <button
      w:rounded="md"
      w:font="medium"
      w:space="x-2"
      w:text="sm gray-300 hover:white"
      w:p="y-2 x-3"
      w:display="flex"
      w:align="center"
      class="btn-focus-ring"
      @click="emit('cancel')"
    >
      <span>{{ t('cancel') }}</span>
    </button>
    <button
      w:rounded="md"
      w:font="medium"
      w:space="x-2"
      w:text="sm gray-300 hover:white"
      w:p="y-2 x-3"
      w:display="flex"
      w:align="center"
      w:bg="green-800"
      class="btn-focus-ring"
      @click="emit('save')"
    >
      <span>{{ t('save') }}</span>
      <icon-mdi-content-save />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  editing: { type: Boolean, required: true },
  save: { type: Boolean, default: false },
});

const emit = defineEmits(['update:editing', 'save', 'cancel']);

const { t } = useI18n();
</script>
