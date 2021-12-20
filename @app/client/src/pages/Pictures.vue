<template>
  <main role="main" w:m="x-auto t-10 b-20" w:max-w="5xl">
    <teleport v-if="store.currentMember" to="#member-bar-left">
      <EditButton v-model:editing="editing" />
    </teleport>
    <PictureUpload v-if="editing" />
    <div ref="gallery" class="pswp-gallery">
      <MuuriGrid v-model:items="items" :options="muuriOptions" key-field="id">
        <template #default="{ item }">
          <div class="item-content">
            <div
              v-if="editing"
              w:pos="absolute"
              w:p="2"
              w:flex="~ row"
              w:justify="between"
              w:w="full"
              w:text="true-gray-200"
            >
              <button
                @click="
                  setAllowOnHome({ id: item.id, input: !item.allowOnHome })
                "
              >
                <icon-mdi-home-minus
                  v-if="item.allowOnHome"
                  class="icon-shadow"
                  w:text="2xl"
                />
                <icon-mdi-home-plus-outline
                  v-else
                  class="icon-shadow"
                  w:text="2xl"
                />
              </button>
              <PictureDelete @confirm="deletePicture({ id: item.id })" />
            </div>
            <a
              :href="item.img.src"
              :data-pswp-width="item.img.width"
              :data-pswp-height="item.img.height"
              :data-pswp-srcset="item.img.srcSetWebp"
              rel="noopener"
              target="_blank"
            >
              <picture>
                <source
                  :srcset="item.img.srcSetWebp"
                  type="image/webp"
                  sizes="20rem"
                />
                <source
                  :srcset="item.img.srcSetJpeg"
                  type="image/jpeg"
                  sizes="20rem"
                />
                <img
                  :src="item.img.src"
                  w:w="80"
                  alt=""
                  :height="item.img.height"
                  :width="item.img.width"
                  loading="lazy"
                />
              </picture>
            </a>
          </div>
        </template>
      </MuuriGrid>
    </div>
  </main>
</template>

<script setup lang="ts">
import 'photoswipe/dist/photoswipe.css';

import {
  DeletePictureMutationDocument,
  PicturesQueryDocument,
  ReorderPicturesMutationDocument,
  SetPictureAllowOnHomeMutationDocument,
} from '@app/graphql/dist/client';
import { useClientHandle } from '@urql/vue';
import PhotoSwipe from 'photoswipe/dist/photoswipe.esm.js';
import PhotoSwipeLightbox from 'photoswipe/dist/photoswipe-lightbox.esm.js';

import { useStore } from '../store';

const editing = ref(false);

const PictureUpload = useWaitImportComponent(
  editing,
  () => import('../components/Picture/PictureUpload.vue')
);

const PictureDelete = useWaitImportComponent(
  editing,
  () => import('../components/Picture/PictureDelete.vue')
);

const { executeMutation: setAllowOnHome } = useMutation(
  SetPictureAllowOnHomeMutationDocument
);

const { executeMutation: deletePicture } = useMutation(
  DeletePictureMutationDocument
);

const muuriOptions = ref({
  dragEnabled: true,
  dragAutoScroll: {
    targets: [document.body],
  },
  dragStartPredicate: {
    distance: 10,
    delay: 100,
  },
});

const { data } = useQuery({
  query: PicturesQueryDocument,
});

interface Item {
  id: string;
  rank: number;
  img: any;
}

const handle = useClientHandle();
const items = computed({
  get(): Item[] {
    const x = data.value?.pictures?.nodes || [];
    return x;
  },
  async set(newItems: Item[]) {
    const reorders: { fromRank: number; toRank: number }[] = [];
    for (const [i, item] of newItems.entries()) {
      if (item.rank !== i) {
        reorders.push({ fromRank: item.rank, toRank: i });
        item.rank = i;
      }
    }
    await handle.client
      .mutation(ReorderPicturesMutationDocument, {
        reorders,
      })
      .toPromise();
  },
});

const gallery = ref<HTMLElement | null>(null);
onMounted(() => {
  const lightbox = new PhotoSwipeLightbox({
    gallery: gallery.value,
    children: 'a',
    pswpModule: PhotoSwipe,
  });
  lightbox.init();
});

useHead({
  title: computed(() => 'Pictures - SMil Aarhus'),
  meta: [
    {
      name: `description`,
      content: computed(() => ''),
    },
  ],
});

const store = useStore();
const { t } = useI18n();
</script>

<style scoped>
.pswp-gallery ::v-deep(.muuri-item-dragging a) {
  pointer-events: none;
}
</style>

<style>
.pswp {
  position: fixed !important;
}
</style>
