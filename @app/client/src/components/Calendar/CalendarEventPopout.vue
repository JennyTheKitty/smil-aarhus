<template>
  <TransitionRoot
    :show="!!(open && event && eventEl)"
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-1 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-1 opacity-0"
  >
    <Dialog :initial-focus="closeButton" @close="closeDialog">
      <DialogOverlay w:pos="inset-0 fixed" />

      <div
        ref="dialog"
        w:rounded="xl"
        w:bg="dark-700"
        w:text="white"
        w:pos="absolute"
        w:shadow="lg"
        w:border="2 pink-800"
        w:z="5"
        :style="popupStyles"
      >
        <div
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
            ref="closeButton"
            w:text="xl gray-300 hover:white"
            w:m="l-4"
            class="btn-focus-ring"
            @click="closeDialog"
          >
            <icon-mdi-close />
          </button>
        </div>
        <div v-if="event?.img">
          <picture>
            <source
              :srcset="event.img.srcSetWebp"
              type="image/webp"
              sizes="400px"
            />
            <source
              :srcset="event.img.srcSetJpeg"
              type="image/webp"
              sizes="400px"
            />
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
        <div w:p="l-8 r-4 t-4 b-8">
          <div v-if="event" w:flex="~ col">
            <span w:text="xl">{{ event.title }}</span>
            <span w:text="sm gray-500">
              {{ d(event.startsAt).format('llll').replace(/ /g, '\xA0') }}
              -
              {{ d(event.endsAt).format('llll').replace(/ /g, '\xA0') }}
            </span>
            <span w:p="y-4">
              {{ event.description }}
            </span>
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
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { CalendarEventBySlugQuery, Event } from '@app/graphql/dist/client';
import { Dialog } from '@headlessui/vue';
import dayjs from 'dayjs';

import { Trans } from '../../i18n';
import { useStore } from '../../store';
import { Translated, useTranslation } from '../../utils';

const props = defineProps<{
  event: NonNullable<CalendarEventBySlugQuery['eventBySlug']> | null;
  eventEl: HTMLElement | null;
  open: boolean;
  container: HTMLElement | null;
}>();
defineEmits(['edit']);

const event = computed(() => useTranslation(props.event, locale));

const router = useRouter();
const dialog = ref<HTMLElement | null>(null);
const closeButton = ref(null);
const d = dayjs;
const store = useStore();
const { locale, t } = useI18n();

const tags = computed(() => {
  if (!props.event) return null;
  return props.event.tags.map((evet) => useTranslation(evet.tag, locale));
});
const groups = computed(() => {
  if (!props.event) return null;
  return props.event.groups.map((evet) => useTranslation(evet.group, locale));
});

function getCoords(elem: HTMLElement) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + window.pageYOffset,
    right: box.right + window.pageXOffset,
    bottom: box.bottom + window.pageYOffset,
    left: box.left + window.pageXOffset,
    width: box.width,
    height: box.height,
  };
}

async function closeDialog() {
  await router.push(Trans.i18nRoute('CALENDAR'));
}

const popupStyles = computed(() => {
  if (!dialog.value) {
    return {
      top: `${window.innerHeight / 2 + window.pageYOffset}px`,
    };
  }
  const dialogEl = dialog.value;
  const el = props.eventEl!;
  if (!el) return;
  const width = 400;
  const height = dialogEl.offsetHeight;
  const xPadding = 16;
  const elCoords = getCoords(el);
  const containerCoords = getCoords(props.container!);

  let left =
    elCoords.left - containerCoords.left + elCoords.width + xPadding + 20;
  if (left + width + xPadding > window.innerWidth) {
    left = elCoords.left - containerCoords.left - width - xPadding;
  }

  let top = window.innerHeight / 2 + window.pageYOffset - height / 2;
  if (top > elCoords.top) top = elCoords.top;
  if (top + height < elCoords.top + elCoords.height)
    top = elCoords.top + elCoords.height - height - 20;
  if (top + height > window.innerHeight + window.pageYOffset) {
    top = window.innerHeight + window.pageYOffset - height;
  }
  return {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
  };
});
</script>
