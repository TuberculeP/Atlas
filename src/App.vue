<script setup lang="ts">
import { createRecipe, createHmap } from "./recipes/utils";
import Recipe from "./components/Recipe.vue";

const { hmap } = createHmap();

[
  "Cuivre",
  "Ferrite pure",
  "Metal Chromatique",
  "Poussiere ferrite",
  "Pugneum",
  "Carbone",
  "Carbone Condensé",
  "Ferrite Magnétisée",
  "Cuivre Activé",
].forEach(
  (name) =>
    (hmap[name] = {
      name,
      for_recipe: [],
      from_recipe: [],
    })
);

createRecipe("Cuivre", 2, [
  ["Metal Chromatique", 1],
  ["Cuivre", 1],
]);

createRecipe("Metal Chromatique", 1, [["Cuivre Activé", 1]]);

createRecipe("Metal Chromatique", 1, [
  ["Ferrite pure", 1],
  ["Cuivre", 1],
]);

createRecipe("Ferrite pure", 3, [
  ["Poussiere ferrite", 2],
  ["Pugneum", 1],
]);

createRecipe("Carbone Condensé", 1, [["Carbone", 2]]);
createRecipe("Ferrite Magnétisée", 1, [["Ferrite pure", 2]]);

createRecipe("Carbone", 2, [["Carbone Condensé", 1]]);
createRecipe("Ferrite pure", 2, [["Ferrite Magnétisée", 1]]);
</script>

<template>
  <div>
    <Recipe :recipe="hmap['Ferrite pure'].from_recipe[0]" />
  </div>
</template>

<style scoped></style>
