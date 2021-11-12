<template>
  <div
    w:bg="dark-900"
    w:text="center sm true-gray-100"
    w:font="leading-relaxed"
    w:p="t-8 b-16"
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
        <a href="#" w:flex="~" w:align="items-center">
          <icon-mdi-map w:m="x-2" />
          {{ t('footer.see-on-map') }}
        </a>
      </div>
      <div w:flex="~ col" w:align="items-center" w:w="64">
        <span w:font="tracking-0.4em">{{ t('footer.contact') }}</span>
        <icon-mdi-mail-ru w:text="3xl" w:m="6" />
        <div w:text="start">
          <span w:flex="~" w:align="items-center">
            <icon-mdi-human-greeting w:m="x-2" />
            {{ t('footer.contact.management') }}
          </span>
          <span w:flex="~" w:align="items-center">
            <icon-mdi-account-group w:m="x-2" />
            {{ t('footer.contact.index') }}
          </span>
          <span w:flex="~" w:align="items-center">
            <icon-mdi-information-outline w:m="x-2" />
            {{ t('footer.contact.info') }}
          </span>
          <span w:flex="~" w:align="items-center">
            <icon-smil-fetlife w:m="x-2" />
            {{ t('footer.contact.fetlife') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>
