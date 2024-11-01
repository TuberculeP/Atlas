<script setup lang="ts">
import type { GComponent } from "~/types";
import type { RecursiveTree } from "~/types";

const props = defineProps<{
  id?: string;
  quantity?: number;
  graph: Map<string, GComponent>;
  currentTree: RecursiveTree;
}>();

const { graph } = props;

const uniqId = Math.random().toString(36).slice(2);

// choisir un item // ou partir de l'id des props si il y en a uyn
// choisir une recette pour l'item
// pour chaque composant nécessaire à la recette je choisis "je l'ai déjà" "je sais où le trouver" "propose moi des recettes"
// Si le choix 3, on affiche un recursive item sur ce choix

const itemGraph = computed(() => Array.from(graph, ([Id, comp]) => comp.value));
const currentItemId = ref<string | undefined>(props.id);
const currentItem = computed(() => graph.get(currentItemId.value ?? ""));
const choice = ref<number>(1);
const availableRecipes = computed(() => currentItem.value?.from_recipe ?? []);
const currentRecipeId = ref<string | null>(props.id ?? null);
const currentRecipe = computed(() =>
  availableRecipes.value.find(({ value }) => value.Id === currentRecipeId.value)
);

watch(
  currentItem,
  () => {
    if (currentItem.value) {
      props.currentTree.item = currentItem.value as GComponent;
      props.currentTree.quantity = props.quantity || 1;
    }
  },
  { immediate: true }
);
watch(
  choice,
  (newChoice) => {
    switch (newChoice) {
      case 1:
        props.currentTree.in_inventory = true;
        break;
      case 2:
        props.currentTree.in_inventory = false;
        break;
      case 3:
        delete props.currentTree.subs;
    }
  },
  { immediate: true }
);
watch(currentRecipe, () => {
  props.currentTree.subs = currentRecipe.value?.inputs.map(() => ({}));
});

onBeforeUnmount(() => {
  delete props.currentTree.subs;
});
</script>

<template>
  <div>
    <div class="item_selector" v-if="!props.id">
      <select
        v-model="currentItemId"
        name="first-item"
        :id="uniqId + 'first-item'"
        placeholder="Select an item"
      >
        <option v-for="item in itemGraph" :key="item.Id" :value="item.Id">
          {{ item.Name }}
        </option>
      </select>
    </div>
    <div v-else>
      <p>
        {{ currentItem?.value.Name }}
        <span v-if="props.quantity">x {{ props.quantity }}</span>
      </p>
    </div>
    <div v-if="currentItem" class="choices">
      <div class="choices">
        <div>
          <input
            v-model="choice"
            type="radio"
            :name="uniqId + 'choice'"
            :id="uniqId + 'choice-1'"
            :value="1"
          />
          <label :for="uniqId + 'choice-1'">I already have it</label>
          <input
            v-model="choice"
            type="radio"
            :name="uniqId + 'choice'"
            :id="uniqId + 'choice-2'"
            :value="2"
          />
          <label :for="uniqId + 'choice-2'">I know where to find it</label>
          <input
            v-model="choice"
            type="radio"
            :name="uniqId + 'choice'"
            :id="uniqId + 'choice-3'"
            :value="3"
            :disabled="!availableRecipes?.length"
          />
          <label :for="uniqId + 'choice-3'">Find recipes</label>
        </div>
      </div>
    </div>
    <template v-if="choice === 3">
      <div class="all-available-recipes" v-if="!!availableRecipes.length">
        <div
          class="available-recipe"
          :class="{ active: currentRecipe?.value.Id === recipe.value.Id }"
          v-for="recipe in availableRecipes"
          :key="uniqId + recipe.value.Id"
          @click="currentRecipeId = recipe.value.Id"
        >
          <div class="inputs">
            <div
              v-for="[comp, amount] in recipe.inputs"
              :key="uniqId + recipe.value.Id + comp.value.Id"
            >
              {{ comp.value.Name }} x
              {{ amount * (quantity || 1) }}
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No recipe available for this item</p>
      </div>
      <div v-if="currentRecipe">
        <div class="items">
          <div
            v-for="([comp, amount], i) in currentRecipe.inputs"
            class="sub-recipe"
          >
            <RecursiveItem
              :graph="graph"
              :id="comp.value.Id"
              :quantity="amount * (quantity || 1)"
              :key="uniqId + comp.value.Id + 'sub'"
              :current-tree="props.currentTree.subs?.[i] as RecursiveTree"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.all-available-recipes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.available-recipe {
  padding: 10px;
  border: 1px solid black;
  &.active {
    background-color: lightblue;
  }
}
.items {
  display: flex;
  gap: 10px;
}

.sub-recipe {
  padding: 10px;
  border: 1px solid red;
}
</style>
