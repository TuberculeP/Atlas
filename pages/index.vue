<script setup lang="ts">
import RecursiveItem from "~/src/components/RecursiveItem.vue";
import { useGraphStore } from "~/store/graphStore";
import type { GComponent, RecursiveTree } from "~/types";

const { graph } = useGraphStore();

const currentTree = reactive<RecursiveTree>({});

const itemsFromTree = computed(() => {
  const items: {
    in_inventory: { item: GComponent; quantity: number }[];
    to_find: { item: GComponent; quantity: number }[];
  } = { in_inventory: [], to_find: [] };

  // recursive function to go through the tree
  function recursiveTreeToItemsHelper(tree: RecursiveTree) {
    // if the tree has a value, add it to the correct list
    if (tree.item?.value) {
      if (tree.in_inventory) {
        if (
          items.in_inventory.some(
            (i) => i.item.value.Id === tree.item?.value?.Id
          )
        ) {
          items.in_inventory.find(
            (i) => i.item.value.Id === tree.item?.value?.Id
          )!.quantity += tree.quantity || 0;
        } else {
          items.in_inventory.push({
            item: tree.item,
            quantity: tree.quantity || 0,
          });
        }
      } else {
        if (
          items.to_find.some((i) => i.item.value.Id === tree.item?.value?.Id)
        ) {
          items.to_find.find(
            (i) => i.item.value.Id === tree.item?.value?.Id
          )!.quantity += tree.quantity || 0;
        } else {
          items.to_find.push({
            item: tree.item,
            quantity: tree.quantity || 0,
          });
        }
      }
    }

    // if the tree has subs, go through them
    if (tree.subs) {
      for (const sub of tree.subs) {
        recursiveTreeToItemsHelper(sub);
      }
    }
  }
  recursiveTreeToItemsHelper(currentTree);
  return items;
});
</script>

<template>
  <ClientOnly>
    <div>
      <div class="total-items">
        <h1>In Inventory</h1>
        <div
          v-for="({ item, quantity }, i) in itemsFromTree.in_inventory"
          class="item"
        >
          <p>{{ item.value.Name }} x {{ quantity }}</p>
        </div>
      </div>
      <div class="total-items">
        <h1>To Find</h1>
        <div
          v-for="({ item, quantity }, i) in itemsFromTree.to_find"
          class="item"
        >
          <p>{{ item.value.Name }} x {{ quantity }}</p>
        </div>
      </div>
      <RecursiveItem :graph="graph" :current-tree="currentTree" />
    </div>
  </ClientOnly>
</template>

<style lang="scss"></style>
