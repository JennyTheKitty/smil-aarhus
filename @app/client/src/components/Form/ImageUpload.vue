<template>
  <n-upload
    :custom-request="upload"
    :show-file-list="false"
    default-upload
    w:h="full"
  >
    <n-upload-dragger w:p="2" w:flex="~ col" w:h="full">
      <div w:flex="~" w:justify="center" v-if="img" w:h="full">
        <img :src="img?.src" w:max-h="30" w:max-w="60" />
      </div>
      <div w:flex="grow" />
      <p w:text="sm" w:font="light" w:m="t-2">
        Click or drag a file to this area to upload
      </p>
    </n-upload-dragger>
  </n-upload>
</template>

<script setup lang="ts">
import { ImageQueryDocument } from '@app/graphql/dist/client';
import { useClientHandle } from '@urql/vue';
import { UploadCustomRequestOptions } from 'naive-ui';

import { PropType } from 'vue';

import { createImage } from '../../utils';

const props = defineProps({
  value: { type: String as PropType<string | null>, default: () => null },
});
const emit = defineEmits(['update:value']);

const handle = useClientHandle();

const { data } = useQuery({
  query: ImageQueryDocument,
  variables: computed(() => ({ id: props.value })),
  pause: computed(() => !props.value),
});

const img = computed(() => {
  return data.value?.image?.img;
});

async function upload(options: UploadCustomRequestOptions) {
  try {
    const image = await createImage(handle, options.file.file!, (percent) =>
      options.onProgress({ percent })
    );
    emit('update:value', image.id);
    options.onFinish();
  } catch (e) {
    options.onError();
    throw e;
  }
}
</script>

<style scoped>
.n-upload ::v-deep(.n-upload-trigger) {
  width: 100%;
  height: 100%;
}
</style>
