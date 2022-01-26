<template>
  <div
    w:bg="dark-900"
    w:text="center sm true-gray-100"
    w:font="leading-relaxed"
    w:p="t-8 b-8"
  >
    <div w:m="x-auto b-8" w:w="max-content">
      <icon-smil-logo w:m="b-4" w:text="9xl" />
    </div>
    <div
      w:flex="~ col md:row"
      w:max-w="7xl"
      w:m="x-auto"
      w:space="y-10 md:x-20 md:y-0"
      w:w="min-content"
    >
      <div w:flex="~ col" w:align="items-center" w:w="64">
        <span w:font="tracking-0.4em">{{ t('footer.where') }}</span>
        <icon-mdi-map-marker w:text="3xl" w:m="6" />
        <span w:text="space-pre-line">{{ t('footer.address') }}</span>
        <span w:font="tracking-tight light" w:text="">
          {{ t('footer.address.help') }}
        </span>
        <a
          href="https://goo.gl/maps/8NeBeSR2rsC6MAHV9"
          target="_blank"
          rel="noopener"
          w:flex="~"
          w:align="items-center"
          w:text="underline underline-true-gray-600"
        >
          <icon-mdi-map w:m="x-2" />
          {{ t('footer.see-on-map') }}
        </a>
      </div>
      <div w:flex="~ col" w:align="items-center" w:w="64">
        <span w:font="tracking-0.4em">{{ t('footer.contact') }}</span>
        <icon-mdi-mail-ru w:text="3xl" w:m="6" />
        <div w:text="start" w:flex="~ col" w:space="y-2 sm:y-0">
          <a
            href="#mail"
            w:flex="~"
            w:p="2 sm:0"
            w:align="items-center"
            w:text="underline underline-true-gray-600"
            @click.stop.prevent="mailto('YmVzdHlyZWxzZUBzbWlsYWFyaHVzLmRr')"
          >
            <icon-mdi-human-greeting w:m="x-2" />
            {{ t('footer.contact.management') }}
          </a>
          <a
            href="#mail"
            w:flex="~"
            w:p="2 sm:0"
            w:align="items-center"
            w:text="underline underline-true-gray-600"
            @click.stop.prevent="mailto('a2FydG90ZWtAc21pbGFhcmh1cy5kaw==')"
          >
            <icon-mdi-account-group w:m="x-2" />
            {{ t('footer.contact.index') }}
          </a>
          <a
            href="#mail"
            w:flex="~"
            w:p="2 sm:0"
            w:align="items-center"
            w:text="underline underline-true-gray-600"
            @click.stop.prevent="mailto('aW5mb0BzbWlsYWFyaHVzLmRr')"
          >
            <icon-mdi-information-outline w:m="x-2" />
            {{ t('footer.contact.info') }}
          </a>
          <a
            href="https://fetlife.com/users/6730952"
            target="_blank"
            rel="noopener"
            w:flex="~"
            w:p="2 sm:0"
            w:align="items-center"
            w:text="underline underline-true-gray-600"
          >
            <icon-smil-fetlife w:m="x-2" />
            {{ t('footer.contact.fetlife') }}
          </a>
        </div>
      </div>
    </div>
    <div w:m="t-12" w:flex="~ col">
      <span w:text="gray-400">© SMil Aarhus</span>
      <span w:text="gray-400">
        Website coding and design by
        <a href="https://fetlife.com/users/12739819">JennyTheKitty</a>
      </span>
      <span w:text="gray-400">
        FetLife® is a registered trademark of BitLove
      </span>
      <span w:text="gray-400">
        Butt Plug icon by Jessica Birn from NounProject.com
      </span>
      <ClientOnly><LoginButton /></ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { atob } from 'abab';

const { t } = useI18n();

function mailto(encoded: string) {
  const a = document.createElement('a');
  a.target = '_blank';
  a.href = `mailto:${atob(encoded)}`;
  a.click();
}
</script>
