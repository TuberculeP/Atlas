<script setup lang="ts">
import type { GameItemModel } from "assistantapps-nomanssky-info";

const validItems = (await useFetch<GameItemModel[]>("/api/items")).data;
</script>

<template>
  <div class="item-wrapper">
    <div class="item" v-for="item in validItems" :key="item.Id">
      <img :src="item.CdnUrl" alt="" />
      <h2>{{ item.Name }}</h2>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
  padding: 1rem;
  border: 1px solid black;
  border-radius: 1rem;
  background-color: #f0f0f0;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
  img {
    width: 100%;
    max-width: 10rem;
    height: auto;
  }
}
</style>
