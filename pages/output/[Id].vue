<script setup lang="ts">
import type { GRecipe } from "~/types";
import { useGraphStore } from "~/store/graphStore";

const route = useRoute();
const { graph, getWaysDetail } = useGraphStore();

const waysMaxDepth = ref(5);

const itemId = route.params.Id as string;
const item = graph.get(itemId);
const allCraftingWays: GRecipe[][] | undefined =
  item && graph.findWaysRaw(item);

const filteredWays = computed(() =>
  allCraftingWays?.filter((way) => way.length <= waysMaxDepth.value)
);
</script>

<template>
  <ClientOnly>
    <div v-if="item">
      <h1>Chemins pour {{ item.value.Name }}</h1>
      <label for="maxDepth">Profondeur maximale</label>
      <input type="number" v-model="waysMaxDepth" id="maxDepth">
      <p v-if="!filteredWays">Pas de chemins</p>
      <template v-else>
        <p>
          Il y a {{ filteredWays.length }} manières d'obtenir du
          {{ item.value.Name }}
        </p>
        <div class="way" v-for="(way, wayIdx) in filteredWays" :key="'way'+wayIdx">
          <div class="step" v-for="(step, stepIdx) in way" :key="'step'+stepIdx+'way'+wayIdx">
            <p>{{ step.inputs.map(([c, qt]) => `${c.value.Name} x ${qt}`).join(" + ") }} ==> {{ step.output.value.Name }}</p>
          </div>
        </div>
      </template>
    </div>
    <p v-else>Item non trouvé</p>
  </ClientOnly>
</template>

<style scoped lang="scss">
.way {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  border: 1px solid black;
  margin: 1rem;
  padding: 1rem;

  .step {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    align-content: center;
    border: 1px solid black;
    margin: 1rem;
    padding: 1rem;
  }
}
</style>