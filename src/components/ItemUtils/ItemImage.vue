<script setup lang="ts">
import type { GameItemModel } from "assistantapps-nomanssky-info";
const { item } = defineProps<{ item: GameItemModel }>();
</script>

<template>
  <div class="image" :style="`background-color: #${item.Colour};`">
    <span class="abbrev" v-if="item.Abbrev">{{ item.Abbrev }}</span>
    <img
      :src="'https://app.nmsassistant.com/assets/images/' + item.Icon"
      alt=""
    />
  </div>
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
