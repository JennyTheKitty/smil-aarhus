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
              :data-credit="item.img.credit"
              :data-id="item.id"
              rel="noopener"
              target="_blank"
            >
              <Image sizes="20rem" :image="item.img" w:w="80" alt="" />
              <teleport
                v-if="lightboxCurrentOpenId == item.id"
                to="#pswp-caption"
              >
                <ImageCredits
                  v-if="!editing && item.img.credit"
                  :content="item.img.credit"
                />
                <ClientOnly>
                  <suspense>
                    <ContentEditor
                      @focus="creditEditorFocussed(true)"
                      @blur="creditEditorFocussed(false)"
                      w:min-w="!2xl"
                      w:bg="dark-500"
                      v-if="editing"
                      v-model="item.img.credit"
                      :inline="false"
                    />
                  </suspense>
                </ClientOnly>
              </teleport>
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
import ImageCredits from '../components/ImageCredits.vue';

const editing = ref(false);
const store = useStore();
const PictureUpload = useWaitImportComponent(
  editing,
  () => import('../components/Picture/PictureUpload.vue')
);

const PictureDelete = useWaitImportComponent(
  editing,
  () => import('../components/Picture/PictureDelete.vue')
);

const ContentEditor = useWaitImportComponent(
  editing,
  () => import('../components/Form/ContentEditor.vue')
);

const { executeMutation: setAllowOnHome } = useMutation(
  SetPictureAllowOnHomeMutationDocument
);

const { executeMutation: deletePicture } = useMutation(
  DeletePictureMutationDocument
);

const muuriOptions = computed(() => ({
  dragEnabled: editing.value,
  dragAutoScroll: {
    targets: [document.body],
  },
  dragStartPredicate: {
    distance: 10,
    delay: 100,
  },
}));

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
    const x = data.value?.pictures || [];
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

const lightbox = ref<any>(null);
const pausedEvents: any[] = [];

function creditEditorFocussed(focus: boolean) {
  if (focus) {
    for (const event of lightbox.value.pswp.events._pool) {
      if (!['scroll', 'resize'].includes(event.type)) {
        pausedEvents.push(event);
        lightbox.value.pswp.events._toggleListener(
          event.target,
          event.type,
          event.listener,
          event.passive,
          true,
          false
        );
      }
    }
  } else {
    while (pausedEvents.length) {
      const event = pausedEvents.pop();
      lightbox.value.pswp.events._toggleListener(
        event.target,
        event.type,
        event.listener,
        event.passive,
        false,
        false
      );
    }
  }
  console.log(focus, lightbox.value.pswp.events._pool, pausedEvents);
}

const lightboxCurrentOpenId = ref<string | null>(null);

const gallery = ref<HTMLElement | null>(null);
onMounted(() => {
  lightbox.value = new PhotoSwipeLightbox({
    gallery: gallery.value,
    children: 'a',
    pswpModule: PhotoSwipe,
  });

  lightbox.value.on('uiRegister', () => {
    lightbox.value.pswp.on('change', () => {
      const currSlideElement: HTMLElement =
        lightbox.value.pswp.currSlide.data.element;
      lightboxCurrentOpenId.value = currSlideElement.dataset.id || '';
    });
    lightbox.value.pswp.on('close', () => {
      lightboxCurrentOpenId.value = null;
    });
    lightbox.value.pswp.ui.registerElement({
      name: 'custom-caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      html: '',
      onInit: (el: HTMLElement) => {
        el.id = 'pswp-caption';
      },
    });
  });
  lightbox.value.on('afterInit', () => {
    console.log();
  });
  lightbox.value.init();
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
.pswp__custom-caption {
  font-size: 16px;
  color: #fff;
  width: max-content;
  text-align: right;
  padding: 1rem;

  position: absolute;
  right: 0;
  bottom: 0px;
}
</style>
