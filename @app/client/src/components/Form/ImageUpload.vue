<template>
  <n-upload :custom-request="upload" :show-file-list="false" default-upload>
    <n-upload-dragger>
      <div w:flex="~" w:justify="center">
        <img v-if="img" :src="img?.src" w:max-h="30" w:max-w="60" />
      </div>
      <p w:text="sm" w:m="t-2">Click or drag a file to this area to upload</p>
    </n-upload-dragger>
  </n-upload>
</template>

<script setup lang="ts">
import { ImageQueryDocument } from '@app/graphql/dist/client';
import { useClientHandle } from '@urql/vue';
import {
  NUpload,
  NUploadDragger,
  UploadCustomRequestOptions,
} from 'naive-ui/lib';

import { createImage } from '../../utils';

const props = defineProps({
  value: { type: String, default: () => null },
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
    const image = await createImage(
      handle,
      options.file.file!,
      (percent) => options.onProgress({ percent }),
      false
    );
    emit('update:value', image.id);
    options.onFinish();
  } catch (e) {
    options.onError();
    throw e;
  }
}
</script>
