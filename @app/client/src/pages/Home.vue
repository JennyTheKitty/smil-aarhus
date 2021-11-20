<template>
  <div>
    <HomeHero />

    <a
      href="#"
      class="btn-focus-ring"
      w:rounded="lg"
      w:cursor="pointer"
      w:m="auto y-4 md:-y-16 md:b-16"
      w:shadow="lg"
      w:w="full"
      w:max-w="80vw md:2xl"
      w:display="block"
      w:overflow="hidden"
      w:z="3"
      w:pos="relative"
      w:border="2 pink-800"
    >
      <div w:bg="dark-800" w:w="full" w:p="4">
        <p w:font="medium" w:text="base pink-500">
          {{ t('home.latest-news') }}
        </p>
        <p w:font="medium" w:text="base md:xl white" w:m="b-2">
          Coronagenåbning!!
        </p>
        <p w:font="light" w:text="sm md:base gray-300">
          Efter at være lukket i lang tid, er SMIL Aarhus lokaler endelig åbne
          igen...
        </p>
      </div>
    </a>

    <main
      role="main"
      w:m="x-auto b-5 md:b-20"
      w:max-w="5xl"
      w:text="true-gray-100"
      w:flex="~ col md:row"
      w:align="items-center"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div w:w="full md:1/2" w:p="x-8 t-0">
        <suspense><Content name="home" /></suspense>
      </div>
      <div
        w:w="full md:1/2"
        w:flex="~ col"
        w:m="md:t-8"
        w:p="x-8 md:0"
        w:max-w="128"
      >
        <div w:grid="~ cols-2 gap-4">
          <div
            v-for="(img, i) in images"
            :key="i"
            w:w="full"
            w:max-h="full"
            w:border="1 pink-800 rounded-md"
            w:pos="relative"
            w:overflow="hidden"
            class="group"
          >
            <a
              w:pos="absolute"
              w:w="full"
              w:h="full"
              w:flex="~"
              w:border="rounded-md"
              w:bg="hover:black hover:opacity-25"
              w:transition="~ duration-200 all"
              href="#"
              tabindex="-1"
            ></a>
            <div
              w:pos="absolute bottom-0"
              w:m="-b-10 group-hover:b-0"
              w:w="full"
              w:h="10"
              w:flex="~"
              w:border="b-rounded-md"
              w:bg="black opacity-75"
              w:align="items-center"
              w:justify="center"
              w:pointer="none"
              w:transition="~ duration-200 all"
            >
              <span w:text="true-gray-100 center">{{
                t('home.more-pictures')
              }}</span>
            </div>
            <img
              class="object-cover"
              w:w="full"
              w:border="rounded-md"
              :src="img"
            />
          </div>
        </div>
        <div w:flex="~" w:justify="center" w:w="full">
          <a
            href="#"
            w:transform="~ md:scale-0 md:focus:scale-100"
            w:p="2"
            w:w="max-content"
            w:m="t-4"
            w:border="rounded-xl"
            class="btn-focus-ring"
          >
            {{ t('home.see-all-pictures') }}
          </a>
        </div>
      </div>
    </main>

    <suspense>
      <HomeEventsSection />
    </suspense>
    <suspense>
      <HomeGroupsSection />
    </suspense>
  </div>
</template>

<script setup lang="ts">
import img1 from '../assets/images/lokale.01.jpg';
import img2 from '../assets/images/lokale.04.jpg';
import img3 from '../assets/images/lokale.05.jpg';
import img4 from '../assets/images/lokale.06.jpg';

const images = [img1, img2, img3, img4];

const { t, locale } = useI18n();
const i18nRoute = inject(key.i18nRoute)!;
</script>
