<script setup lang="ts">
import { useGraphStore } from "~/store/graphStore";
const props = defineProps<{ id: string }>();

const { graph } = useGraphStore();

const item = ref(graph.get(props.id));

watch(
  () => props.id,
  (newId) => {
    item.value = graph.get(newId);
  }
);
</script>

<template>
  <ClientOnly>
    <div v-if="item" class="image" :style="`background-color: #${item.value.Colour};`">
      <span class="abbrev" v-if="item.value.Abbrev">{{ item.value.Abbrev }}</span>
      <img
        :src="'https://app.nmsassistant.com/assets/images/' + item.value.Icon"
        alt=""
      />
    </div>
  </ClientOnly>
</template>

<style scoped lang="scss">
div.image {
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
  position: relative;

  span.abbrev {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: white;
    opacity: 0.7;
    border-radius: 20px;
    padding: 7px 7px 4px;
    width: fit-content;
    font-size: 10px;
    display: inline-flex;
    align-items: center;
    line-height: 0.5;
    vertical-align: bottom;
    color: black;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
}
</style>
