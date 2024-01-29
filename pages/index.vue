<script setup lang="ts">
import type { GameItemModel } from "assistantapps-nomanssky-info";
import Item from "../src/components/Item.vue";
import ItemInspect from "../src/components/ItemInspect.vue";
import { useGraphStore } from "~/store/graphStore";

const { graph } = useGraphStore();

const search = ref("");
const filteredItems = computed(() =>
  Array.from(graph, ([Id, comp]) => comp.value).filter((item) => {
    const searchLower = search.value.toLowerCase();
    return (
      item.Name.toLowerCase().includes(searchLower) ||
      item.Abbrev?.toLowerCase().includes(searchLower)
    );
  })
);

const currentItemId = ref<string | null>(
  filteredItems.value ? filteredItems.value[0]?.Id : null
);
</script>

<template>
  <ClientOnly>
    <main v-if="graph">
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
            @click="currentItemId = item.Id"
          />
        </div>
      </div>
      <ItemInspect :id="currentItemId" />
    </main>
  </ClientOnly>
</template>

<style scoped lang="scss">
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
