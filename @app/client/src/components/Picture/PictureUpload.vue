<template>
  <div w:flex="~" w:justify="center">
    <NaiveWrapper w:text="white">
      <n-upload
        multiple
        accept="image/*"
        default-upload
        :show-cancel-button="false"
        :custom-request="upload"
      >
        <n-upload-dragger>
          <div w:flex="~" w:justify="center" w:m="b-4">
            <icon-mdi-upload w:text="5xl" />
          </div>
          <p>Click or drag a file to this area to upload</p>
        </n-upload-dragger>
      </n-upload>
    </NaiveWrapper>
  </div>
</template>

<script setup lang="ts">
import { CreatePictureDocument } from '@app/graphql/dist/client';
import { useClientHandle } from '@urql/vue';
import { UploadCustomRequestOptions } from 'naive-ui/lib/upload';

import { createImage } from '../../utils';

const handle = useClientHandle();

async function createPicture(imageId: number) {
  await handle.client
    .mutation(CreatePictureDocument, {
      image: imageId,
    })
    .toPromise();
}

async function upload(options: UploadCustomRequestOptions) {
  try {
    const image = await createImage(handle, options.file.file!, (percent) =>
      options.onProgress({ percent })
    );
    await createPicture(image.id);
    options.onFinish();
  } catch (e) {
    options.onError();
    throw e;
  }
}
</script>
