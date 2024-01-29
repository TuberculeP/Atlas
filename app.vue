<script setup lang="ts">
import type { GameItemModel } from "assistantapps-nomanssky-info";
import Item from "./src/components/Item.vue";
import ItemInspect from "./src/components/ItemInspect.vue";

const validItems = (await useFetch<GameItemModel[]>("/api/items")).data;

const search = ref("");
const filteredItems = computed(() =>
  validItems.value?.filter((item) => {
    const searchLower = search.value.toLowerCase();
    return (
      item.Name.toLowerCase().includes(searchLower) ||
      item.Abbrev?.toLowerCase().includes(searchLower)
    );
  })
);

const currentItem = ref<GameItemModel | null>(
  filteredItems.value ? filteredItems.value[0] : null
);
</script>

<template>
  <main v-if="validItems">
    <div class="select-item">
      <input
        v-model="search"
        :placeholder="'Search in ' + filteredItems?.length + ' products'"
      />

      <div class="item-wrapper">
        <Item
          v-for="item in filteredItems"
          :key="item.Id"
          :item="item"
          @click="currentItem = item"
        />
      </div>
    </div>
    <ItemInspect :item="currentItem" />
  </main>
</template>

<style lang="scss">
@font-face {
  font-family: "NMSFuturaProBook";
  src: url("https://font.nmscd.com/assets/font/NMSFuturaProBook_Kerned/Web-TT/NMSFuturaProBook_Kerned.eot");
  src: url("https://font.nmscd.com/assets/font/NMSFuturaProBook_Kerned/Web-TT/NMSFuturaProBook_Kerned.eot?#iefix")
      format("embedded-opentype"),
    url("https://font.nmscd.com/assets/font/NMSFuturaProBook_Kerned/Web-TT/NMSFuturaProBook_Kerned.woff")
      format("woff"),
    url("https://font.nmscd.com/assets/font/NMSFuturaProBook_Kerned/Web-TT/NMSFuturaProBook_Kerned.ttf")
      format("truetype");
}
* {
  font-family: "NMSFuturaProBook";

  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

main {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 300px;
  .select-item {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100vh;

    input {
      padding: 5px 10px;
      background-color: rgb(228, 228, 228);
      border-radius: 20px;
      border: none;
      width: fit-content;
      margin: 20px auto;
      text-align: center;
    }

    .item-wrapper {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 20px;
      flex-wrap: wrap;
      padding: 20px 30px;
      overflow: scroll;
      height: 100%;
    }
  }
}
</style>
