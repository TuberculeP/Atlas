<script setup lang="ts">
import type { GameItemModel } from "assistantapps-nomanssky-info";
import ItemImage from "./ItemUtils/ItemImage.vue"
const { item } = defineProps<{ item: GameItemModel }>();
</script>
<template>
  <div class="item">
    <h4>{{ item.Name }}</h4>
    <ItemImage :item="item" />
  </div>
</template>

<style scoped lang="scss">
.item {
  width: 150px;
  border: 1px solid grey;
  padding: 10px;
  background: white;
  transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
  h4 {
    text-align: center;
    padding: 5px 0px;
  }
  &:hover {
    cursor: pointer;
    transform: scale(1.01);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  }
}
</style>
