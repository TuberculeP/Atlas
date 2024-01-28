<script setup lang="ts">
import { createRecipe, hmap } from "atlas";
import Recipe from "./components/Recipe.vue";
import componentsJSON from "./nms_data/components.json";
import { GameItemService } from "assistantapps-nomanssky-info";
const gameService = new GameItemService();
const allItems = await gameService.getAllItemDetails();
console.log(allItems)

const components = componentsJSON as Record<string, string>[];

components.forEach(
  ({name, image}) =>
    (hmap[name] = {
      name,
      image,
      for_recipe: [],
      from_recipe: [],
    })
);

createRecipe("Cuivre", 2, [
  ["Métal chromatique", 1],
  ["Cuivre", 1],
]);

createRecipe("Métal chromatique", 1, [["Cuivre activé", 1]]);

createRecipe("Métal chromatique", 1, [
  ["Ferrite pure", 1],
  ["Cuivre", 1],
]);

createRecipe("Ferrite pure", 3, [
  ["Poussière de ferrite", 2],
  ["Pugnéum", 1],
]);

createRecipe("Carbone condensé", 1, [["Carbone", 2]]);
createRecipe("Ferrite magnétisée", 1, [["Ferrite pure", 2]]);

createRecipe("Carbone", 2, [["Carbone condensé", 1]]);
createRecipe("Ferrite pure", 2, [["Ferrite magnétisée", 1]]);

</script>

<template>
  <div>
    <div v-for="({ name, from_recipe }, i) in hmap" :key="name + i">
      <h2>{{ name }}</h2>
      <ul>
        <Recipe
          v-for="(recipe, i) in from_recipe"
          v-bind="recipe"
          :key="'recipe' + recipe.output.name + i"
        />
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
