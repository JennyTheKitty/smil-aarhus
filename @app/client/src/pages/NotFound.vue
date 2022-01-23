<template>
  <main class="bg-dark-700 h-70vh relative overflow-hidden">
    <div
      class="
        container
        flex
        mx-auto
        h-70vh
        px-6
        pt-32
        z-10
        items-center
        justify-between
        md:pt-0
      "
    >
      <div
        class="
          container
          flex flex-col-reverse
          mx-auto
          px-6
          justify-between
          items-center
          relative
          lg:flex-row
        "
      >
        <div class="text-center mb-16 w-full md:mb-8 lg:text-left">
          <h1
            class="
              font-light font-sans
              mt-12
              text-center text-5xl text-gray-200
              md:mt-0
              lg:text-left lg:text-8xl
            "
          >
            Denne side kunne ikke findes
          </h1>
          <button
            class="
              rounded-full
              border-2 border-gray-200
              text-white text-sm
              py-1.5
              pr-4
              pl-4
              transition
              ease-in
              duration-200
              hidden
              items-center
              uppercase
              group
              relative
              md:flex
              hover:(bg-gray-200
              text-black)
              focus:outline-none
              active:top-0.5
              focus-visible:(bg-gray-200
              text-black)
              "
          >
            <span>Gå til forsiden</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useContext } from 'vite-ssr';

const { writeResponse } = useContext();

if (import.meta.env.SSR) {
  writeResponse({
    status: 404,
    headers: {},
  });
}
</script>
