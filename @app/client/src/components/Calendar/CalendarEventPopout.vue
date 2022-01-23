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
        w:z="500"
        :style="popupStyles"
      >
        <CalendarEventDetails
          :event="event"
          :closeable="true"
          @close="closeDialog"
          @edit="$emit('edit')"
        />
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { CalendarEventBySlugQuery, Event } from '@app/graphql/dist/client';
import { Dialog } from '@headlessui/vue';

import { Trans } from '../../i18n';

const props = defineProps<{
  event: NonNullable<CalendarEventBySlugQuery['eventBySlug']> | null;
  eventEl: HTMLElement | null;
  open: boolean;
  container: HTMLElement | null;
}>();
defineEmits(['edit']);

const router = useRouter();
const dialog = ref<HTMLElement | null>(null);
const closeButton = ref(null);

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

  if (window.innerWidth < 1000) {
    return {
      top: `${window.pageYOffset}px`,
      left: `${window.pageXOffset}px`,
      width: `${window.innerWidth}px`,
    };
  }

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
