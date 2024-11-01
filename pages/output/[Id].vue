<script setup lang="ts">
import type { WayWithDetails } from "~/types";
import { useGraphStore } from "~/store/graphStore";
import ItemImage from "~/src/components/ItemUtils/ItemImage.vue";

const route = useRoute();
const { graph, getWaysDetail } = useGraphStore();

const waysMaxDepth = ref(5);

const itemId = route.params.Id as string;
const item = graph.get(itemId);
item && (document.title = "Recipes for: " + item?.value.Name);
const allCraftingWays: WayWithDetails[] | undefined =
  item && graph.findWays(item);

const filteredWays = computed(() =>
  allCraftingWays?.filter((way) => way.steps.length <= waysMaxDepth.value)
);
</script>

<template>
  <ClientOnly>
    <div v-if="item">
      <h1>Chemins pour {{ item.value.Name }}</h1>
      <label for="maxDepth">Profondeur maximale</label>
      <input type="number" v-model="waysMaxDepth" id="maxDepth" />
      <p v-if="!filteredWays">Pas de chemins</p>
      <template v-else>
        <p>
          Il y a {{ filteredWays.length }} manières d'obtenir du
          {{ item.value.Name }}
        </p>
        <div
          class="way"
          v-for="(wayWithDetails, wayIdx) in filteredWays"
          :key="'way' + wayIdx"
        >
          <div class="requirements">
            <template
              v-for="([comp, qt], inputIdx) in wayWithDetails.requirements"
              :key="'input' + inputIdx + 'way' + wayIdx"
            >
              <div class="image">
                <ItemImage :id="comp.value.Id" />
                <p>{{ qt }}</p>
              </div>
            </template>
          </div>
          <div
            class="step"
            v-for="(step, stepIdx) in wayWithDetails.steps"
            :key="'step' + stepIdx + 'way' + wayIdx"
          >
            <template
              v-for="([comp, qt], inputIdx) in step.inputs"
              :key="'input' + inputIdx + 'step' + stepIdx + 'way' + wayIdx"
            >
              <div class="image">
                <ItemImage :id="comp.value.Id" />
                <p>{{ qt }}</p>
              </div>
            </template>
            <div class="output-image">
              <div class="image">
                <ItemImage :id="step.output[0].value.Id" />
              </div>
              <p>{{ step.output[1] }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
    <p v-else>Item non trouvé</p>
  </ClientOnly>
</template>

<style scoped lang="scss">
.way {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  border: 1px solid black;
  margin: 1rem;
  padding: 1rem;
  .image {
    width: 100px;
    text-align: center;
  }
  .requirements {
    grid-column: 1 / -1;
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
    align-items: center;
    background-color: rgb(221, 221, 221);
    padding: 20px;
    width: fit-content;
  }

  .step {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    border: 1px solid black;
    margin: 1rem;
    padding: 1rem;
    .output-image {
      width: 100px;
      text-align: center;
      .image {
        box-shadow: 0 0 10px goldenrod;
        border-radius: 100%;
        overflow: clip;
      }
    }
  }
}
</style>
