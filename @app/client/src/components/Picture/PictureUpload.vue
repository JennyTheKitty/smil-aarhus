<template>
  <div w:flex="~" w:justify="center">
    <n-config-provider :theme="darkTheme" w:text="white">
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
    </n-config-provider>
  </div>
</template>

<script setup lang="ts">
import {
  CreateImageMutationDocument,
  CreatePictureDocument,
  GetUploadUrlDocument,
} from '@app/graphql/dist/client';
import { useClientHandle } from '@urql/vue';
import axios from 'axios';
import { darkTheme, NConfigProvider, NUpload, NUploadDragger } from 'naive-ui';
import { FileInfo } from 'naive-ui/lib/upload/src/interface';

const handle = useClientHandle();

interface UploadCustomRequestOptions {
  file: FileInfo;
  action?: string;
  data?:
    | Record<string, string>
    | (({ file }: { file: FileInfo }) => Record<string, string>);
  withCredentials?: boolean;
  headers?:
    | Record<string, string>
    | (({ file }: { file: FileInfo }) => Record<string, string>);
  onProgress: (e: { percent: number }) => void;
  onFinish: () => void;
  onError: () => void;
}

interface UploadInfo {
  url: string;
  data: FormData;
}

async function getUploadUrl(fileType: string): Promise<UploadInfo> {
  const { data } = await handle.client
    .mutation(GetUploadUrlDocument, {
      contentType: fileType,
      randomId: Math.random().toString(),
    })
    .toPromise();
  if (!data || !data.createUploadUrl) throw new Error('Get upload url failed.');
  const formData = new FormData();
  console.log(data);
  for (const [key, val] of Object.entries(
    JSON.parse(data.createUploadUrl.formData) as { [key: string]: string }
  )) {
    formData.append(key, val);
  }
  return { url: data.createUploadUrl.uploadUrl, data: formData };
}

async function uploadFile(
  file: File,
  info: UploadInfo,
  progressCallback: (percent: number) => void
): Promise<string> {
  info.data.append('file', file);
  const res = await axios.post(info.url, info.data, {
    onUploadProgress: (e: ProgressEvent) =>
      progressCallback(e.loaded / e.total),
  });
  return new URL(res.headers.location).pathname.split('/').slice(2).join('/');
}

function getImageFileDimentions(
  file: File
): Promise<{ height: number; width: number }> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.addEventListener('load', () => {
      resolve({ height: img.height, width: img.width });
      URL.revokeObjectURL(objectUrl);
    });
    img.src = objectUrl;
  });
}

async function createImage(
  file: File,
  progressCallback: (percent: number) => void
): Promise<number> {
  const { height, width } = await getImageFileDimentions(file);
  const info = await getUploadUrl(file.type);
  console.log(info);
  const url = await uploadFile(file, info, progressCallback);
  const { data } = await handle.client
    .mutation(CreateImageMutationDocument, {
      path: url,
      height,
      width,
    })
    .toPromise();
  if (!data?.createImage?.image) throw new Error('Could not create image');
  console.log(data);
  return data.createImage.image.id;
}

async function createPicture(imageId: number) {
  const { data } = await handle.client
    .mutation(CreatePictureDocument, {
      image: imageId,
    })
    .toPromise();
}

async function upload(options: UploadCustomRequestOptions) {
  console.log(options);
  try {
    const imageId = await createImage(options.file.file!, (percent) =>
      options.onProgress({ percent })
    );
    console.log(imageId);
    await createPicture(imageId);
    options.onFinish();
  } catch (e) {
    options.onError();
    throw e;
  }
}
</script>
