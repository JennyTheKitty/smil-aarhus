<template>
  <div
    v-if="event"
    w:flex="~"
    w:justify="end"
    w:text="lg shadow-sm"
    w:pos="absolute top-0 left-0"
    w:w="full"
    :w:p="event?.img ? 't-2 r-2' : 't-4 r-4'"
  >
    <button
      v-if="store.currentMember"
      w:text="gray-300 hover:white"
      class="btn-focus-ring"
      @click="$emit('edit')"
    >
      <icon-mdi-pencil />
    </button>

    <button
      v-if="store.currentMember"
      w:text="gray-300 hover:white"
      w:m="l-2"
      class="btn-focus-ring"
    >
      <icon-mdi-trash />
    </button>

    <button
      v-if="closeable"
      ref="closeButton"
      w:text="xl gray-300 hover:white"
      w:m="l-4"
      class="btn-focus-ring"
      @click="$emit('close')"
    >
      <icon-mdi-close />
    </button>
  </div>
  <div v-if="event?.img">
    <picture>
      <source :srcset="event.img.srcSetWebp" type="image/webp" sizes="400px" />
      <source :srcset="event.img.srcSetJpeg" type="image/webp" sizes="400px" />
      <img
        alt=""
        :src="event.img.src"
        :height="event.img.height"
        :width="event.img.width"
        loading="lazy"
        w:w="full"
        w:h="50"
        w:object="cover"
        w:rounded="t-lg"
        w:border="pink-600 b-2"
      />
    </picture>
  </div>
  <div w:p="l-8 r-4 t-4 b-8" v-if="event">
    <div v-if="event" w:flex="~ col">
      <span w:text="xl">{{ event.title }}</span>
      <span w:text="sm gray-500">
        {{ dayjs(event.startsAt).format('llll').replace(/ /g, '\xA0') }}
        -
        {{ dayjs(event.endsAt).format('llll').replace(/ /g, '\xA0') }}
      </span>
      <span w:p="y-4" v-html="event.description"> </span>
      <div v-if="tags && tags.length > 0" w:flex="~" w:space="x-2">
        <span w:text="sm gray-500">{{ t('kategorier') }}:</span>
        <span
          v-for="tag in tags"
          :key="tag!.id"
          w:rounded="full"
          w:bg="red-700"
          w:p="x-1"
        >
          {{tag!.title }}
        </span>
      </div>

      <div v-if="groups && groups.length > 0" w:flex="~" w:space="x-2">
        <span w:text="sm gray-500">{{ t('arrangeret-af') }}:</span>
        <span
          v-for="group in groups"
          :key="group!.id"
          w:rounded="full"
          w:bg="red-700"
          w:p="x-1"
        >
          {{group!.title }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarEventBySlugQuery } from '@app/graphql/dist/client';
import dayjs from 'dayjs';

const props = defineProps<{
  event: NonNullable<CalendarEventBySlugQuery['eventBySlug']> | null;
  closeable: boolean;
}>();
defineEmits(['close', 'edit']);

const store = useStore();
const { locale, t } = useI18n();

const event = computed(() => useTranslation(props.event, locale));

const tags = computed(() => {
  if (!props.event) return null;
  return props.event.tags.map((evet) => useTranslation(evet.tag, locale));
});
const groups = computed(() => {
  if (!props.event) return null;
  return props.event.groups.map((evet) => useTranslation(evet.group, locale));
});
</script>
