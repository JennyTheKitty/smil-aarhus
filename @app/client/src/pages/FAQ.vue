<template>
  <div w:bg="dark-500" w:p="y-20 x-4">
    <div w:flex="~ col md:row" w:m="x-auto" w:max-w="6xl" w:text="gray-100">
      <div w:w="full md:1/3" w:m="md:r-8">
        <h2 w:font="leading-9" w:text="pink-500 4xl">
          Frequently Asked Questions
        </h2>
        <span w:m="t-2" w:display="block">
          For other inquiries, please use the contact links at the bottom of the
          page.
        </span>
      </div>
      <dl class="w-full md:w-2/3">
        <suspense><Content name="faq" /></suspense>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
