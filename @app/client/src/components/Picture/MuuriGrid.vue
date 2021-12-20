<template>
  <div ref="el" class="grid">
    <div
      v-for="item in items"
      :key="item[keyField]"
      class="item"
      :data-key="item[keyField]"
    >
      <slot :item="item" />
    </div>
  </div>
</template>

<script lang="ts">
const gridEvents = [
  'synchronize',
  'layoutStart',
  'layoutEnd',
  'layoutAbort',
  'add',
  'remove',
  'showStart',
  'showEnd',
  'hideStart',
  'hideEnd',
  'filter',
  'sort',
  'move',
  'send',
  'beforeSend',
  'receive',
  'beforeReceive',
  'dragInit',
  'dragStart',
  'dragMove',
  'dragScroll',
  'dragEnd',
  'dragReleaseStart',
  'dragReleaseEnd',
  'destroy',
] as const;
</script>

<script setup lang="ts">
// heavily based on https://gist.github.com/sploders101/e80c244310e1e7d8b996f7a98faee9be
import Muuri, { Item, LayoutData, LayoutFunctionCallback } from 'muuri';

Muuri.defaultPacker.destroy();
Muuri.defaultPacker = new Muuri.Packer(0);

interface Props {
  options: Muuri.GridOptions;
  items: any[];
  keyField: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:items', ...gridEvents]);

const muuri = ref<Muuri | null>(null);
const el = ref<HTMLElement | null>(null);
const items = computed({
  get(): any[] {
    return props.items;
  },
  set(items: any[]): void {
    console.log(items);
    emit('update:items', items);
  },
});

function layout() {
  if (muuri.value) {
    muuri.value.refreshItems();
    muuri.value.layout();
  }
}

function getOrder(): string[] {
  if (muuri.value) {
    return muuri.value
      .getItems()
      .map((item) => item.getElement()!.dataset.key!);
  }
  return [];
}

function updateData() {
  if (!muuri.value) return;
  const order = getOrder();
  items.value = items.value.sort(
    (a, b) =>
      order.indexOf(a[props.keyField]) - order.indexOf(b[props.keyField])
  );
}

watch(
  () => props.options,
  async () => {
    if (props.options !== null) {
      await until(el).not.toBe(null);
      if (muuri.value) muuri.value.destroy();

      const options = {
        ...props.options,
        layout: (
          grid: Muuri,
          id: number,
          items: Item[],
          width: number,
          height: number,
          callback: LayoutFunctionCallback
        ) => {
          Muuri.defaultPacker.setOptions({ fillGaps: true });

          const callbackWrapper = (layout: LayoutData) => {
            const itemWidth =
              layout.items.length > 0
                ? (layout.items[0] as Item & { _width: number })._width
                : 320;
            const columns = Math.floor(width / (itemWidth + 10));
            const left = (width - columns * (itemWidth + 10)) / 2;
            layout.slots = layout.slots.map((slot, i) =>
              i % 2 == 0 ? slot + left : slot
            );
            return callback(layout);
          };

          const cancelLayout = Muuri.defaultPacker.createLayout(
            grid,
            id,
            items,
            width,
            height,
            callbackWrapper
          );

          return cancelLayout;
        },
      };

      muuri.value = new Muuri(el.value!, options);
      muuri.value.on('move', () => updateData());
      for (const event of gridEvents) {
        muuri.value.on(event, (...args: any[]) => emit(event, ...args));
      }
    }
  },
  { immediate: true }
);

watch(
  items,
  async (newItems: any[], oldItems: any[]) => {
    await until(muuri).not.toBe(null);

    // Map to what vue uses as keys (used to determine what to update/replace/reorder)
    const oldKeys = oldItems.map((e) => e[props.keyField]);
    const newKeys = newItems.map((e) => e[props.keyField]);
    // Get which keys (individual elements) were added/removed
    const added = newKeys.filter((key) => oldKeys.indexOf(key) === -1);
    const removed = oldKeys.filter((key) => newKeys.indexOf(key) === -1);

    removed.forEach((po) => {
      muuri.value!.remove(muuri.value!.getItems(getOrder().indexOf(po)), {
        // Vue will take care of this
        removeElements: false,
        // We will be adding items too, so not quite yet
        layout: false,
      });
    });
    await nextTick();
    // Now add in the new ones
    muuri.value!.add(
      Array.from(el.value!.childNodes).filter(
        (el) =>
          el instanceof HTMLElement && added.indexOf(el.dataset.key!) !== -1
      ) as HTMLElement[],
      {
        // We will be re-ordering, so wait a bit longer
        layout: false,
      }
    );
    // Re-order if needed
    const items = muuri.value!.getItems();
    const newOrder = items.map((item) => item[props.keyField]);
    muuri.value!.sort((a, b) => {
      return (
        newOrder.indexOf(a.getElement()!.dataset.key!) -
        newOrder.indexOf(b.getElement()!.dataset.key!)
      );
    });
    // Now we can start the layout
    layout();
  },
  { deep: true }
);
</script>

<style scoped>
.grid {
  position: relative;
}
.item {
  display: block;
  position: absolute;
  width: min(20rem, 90vw);
  margin: 5px;
  z-index: 1;
  background: #000;
  color: #fff;
}
.item.muuri-item-dragging {
  z-index: 3;
}
.item.muuri-item-releasing {
  z-index: 2;
}
.item.muuri-item-hidden {
  z-index: 0;
}
.item-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
