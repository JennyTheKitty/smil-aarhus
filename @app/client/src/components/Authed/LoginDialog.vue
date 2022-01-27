<template>
  <BaseDialog
    :is-open="isOpen"
    @update:is-open="$emit('update:isOpen', $event)"
  >
    <div
      w:w="md"
      w:rounded="lg"
      w:shadow="lg"
      w:pos="relative"
      w:border="2 pink-800"
      w:bg="dark-800"
      w:text="white"
      w:p="4"
    >
      <DialogTitle w:text="center lg" w:m="0 b-4">
        Login to SMil Aarhus
      </DialogTitle>
      <NaiveWrapper>
        <n-form
          :label-width="80"
          :model="model"
          label-placement="left"
          @submit="submit"
        >
          <n-form-item label="Username" path="username">
            <n-input v-model:value="model.username" placeholder="Username" />
          </n-form-item>
          <n-form-item label="Password" path="password">
            <n-input
              v-model:value="model.password"
              placeholder="Password"
              type="password"
            />
          </n-form-item>
          <n-form-item class="t" :feedback="feedback">
            <input type="submit" w:display="hidden" />
            <div w:flex="grow"></div>
            <n-button @click="submit">Login</n-button>
          </n-form-item>
        </n-form>
      </NaiveWrapper>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { AuthenticateDocument } from '@app/graphql/dist/client';

import { accessToken } from '../../accessToken';

defineProps<{
  isOpen: boolean;
}>();
const emit = defineEmits(['update:isOpen']);

const model = ref({
  username: '',
  password: '',
});

const feedback = ref('');

const { executeMutation: login } = useMutation(AuthenticateDocument);

async function submit(e: Event) {
  e.preventDefault();
  const { error, data } = await login(model.value);
  if (error) feedback.value = error.graphQLErrors[0].message;

  accessToken.value = data!.authenticate!;
  emit('update:isOpen', false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>
