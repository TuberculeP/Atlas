<script setup lang="ts">
import type {
  GameItemModel,
  ProcessorItemDetails,
} from "assistantapps-nomanssky-info";
import ItemImage from "./ItemUtils/ItemImage.vue";
import useDescriptionParser from "../composables/useDescriptionParser";

const props = defineProps<{ item: GameItemModel | null }>();

const { parseDescription } = useDescriptionParser();

const recipes: Ref<ProcessorItemDetails[] | null> = (
  await useFetch<ProcessorItemDetails[]>(
    "/api/recipes?output=" + props.item?.Id
  )
).data;

watch(
  () => props.item,
  async () => {
    recipes.value = (
      await useFetch<ProcessorItemDetails[]>(
        "/api/recipes?output=" + props.item?.Id
      )
    ).data.value;
  }
);
</script>

<template>
  <div class="inspect">
    <template v-if="props.item">
      <h1>{{ props.item.Name }}</h1>
      <ItemImage :item="props.item" />
      <pre>{{ props.item.Id }}</pre>
      <p v-html="parseDescription(props.item.Description)" />
      <p v-if="recipes?.length">Involved in {{ recipes.length }} refinery processes</p>
    </template>
  </div>
</template>

<style scoped lang="scss">
div.inspect {
  width: 100%;
  padding: 20px;
  height: 100vh;
  overflow: scroll;
  background-color: rgb(0, 0, 0);
  color: white;
}
h1 {
  text-align: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid gray;
}

p {
  margin: 10px 0;
  line-height: 1.2;
}
</style>
