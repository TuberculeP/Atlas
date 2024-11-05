<script setup lang="ts">
import { useVueFlow, type NodeProps } from "@vue-flow/core";
import type { GComponent } from "~/types";
import type { RecursiveTree } from "~/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Ingredient from "./Ingredient.vue";

const { fitView } = useVueFlow();

const props = defineProps<{
  node: NodeProps;
  graph: Map<string, GComponent>;
}>();

const { graph } = props;

const currentTree = props.node.data as RecursiveTree;

const uniqId = Math.random().toString(36).slice(2);
const itemGraph = computed(() => Array.from(graph, ([, comp]) => comp.value));
const currentItemId = ref<string | undefined>(currentTree.item?.value.Id);
const currentItem = computed(() => graph.get(currentItemId.value ?? ""));
const choice = ref<number>(3);
const availableRecipes = computed(() => currentItem.value?.from_recipe ?? []);
const currentRecipeId = ref<string | null>(null);
const currentRecipe = computed(() =>
  availableRecipes.value.find(({ value }) => value.Id === currentRecipeId.value)
);

watch(
  currentItem,
  () => {
    if (currentItem.value) {
      currentTree.item = currentItem.value as GComponent;
      delete currentTree.subs;
    }
  },
  { immediate: true }
);
watch(
  choice,
  (newChoice) => {
    delete currentTree.subs;
    currentRecipeId.value = null;
    switch (newChoice) {
      case 1:
        currentTree.in_inventory = true;
        currentTree.to_find = false;
        break;
      case 2:
        currentTree.in_inventory = false;
        currentTree.to_find = true;
        break;
      case 3:
        currentTree.in_inventory = false;
        currentTree.to_find = false;
    }
  },
  { immediate: true }
);
watch(currentRecipe, () => {
  delete currentTree.subs;
  currentTree.subs = currentRecipe.value?.inputs.map(([comp, amount], i) => ({
    node_id: Math.random().toString(36).slice(2),
    item: comp,
    quantity: amount * (currentTree.quantity || 1),
    to_find: true,
    in_inventory: false,
  }));
});

onBeforeUnmount(() => {
  delete currentTree.subs;
});
</script>

<template>
  <div>
    <div class="item_selector" v-if="!currentItemId">
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
      <Ingredient
        :item="(currentItem as GComponent)"
        :quantity="currentTree.quantity"
      />
    </div>
    <div v-if="currentItem" class="choices">
      <Tabs v-model="choice">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger :value="3"> Craft </TabsTrigger>
          <TabsTrigger :value="1"> Farm </TabsTrigger>
          <TabsTrigger :value="2"> In inventory </TabsTrigger>
        </TabsList>
        <TabsContent :value="1">
          <span class="font-semibold">
            {{ currentItem.value.Name }}
          </span>
          Added to the list of items to find.
          <span class="underline" @click="() => fitView()">Branch ended.</span>
        </TabsContent>
        <TabsContent :value="2">
          <span class="font-semibold">
            {{ currentItem.value.Name }}
          </span>
          Added to the list of items in inventory.
          <span class="underline" @click="() => fitView()">Branch ended.</span>
        </TabsContent>
        <TabsContent :value="3">
          <Dialog>
            <div class="flex justify-center">
              <DialogTrigger>
                <Button v-if="!currentRecipe">Select Recipe</Button>
                <Button v-else variant="outline">
                  {{ currentRecipe.value.Operation }}
                </Button>
              </DialogTrigger>
            </div>
            <DialogContent
              class="max-h-[90dvh] max-w-[90dvw] grid-rows-[auto_minmax(0,1fr)_auto]"
            >
              <DialogHeader>
                <DialogTitle>{{
                  currentRecipe?.value.Operation || "Select a recipe"
                }}</DialogTitle>
                <div class="flex items-center gap-3">
                  <DialogDescription>
                    <p>Select the recipe you want to use to craft :</p>
                  </DialogDescription>
                  <Ingredient
                    :item="currentItem"
                    :quantity="currentTree.quantity"
                  />
                </div>
              </DialogHeader>

              <div
                class="all-available-recipes"
                v-if="!!availableRecipes.length"
              >
                <Card
                  :class="{
                    active: currentRecipe?.value.Id === recipe.value.Id,
                  }"
                  class="hover:cursor-pointer hover:bg-slate-100"
                  v-for="recipe in availableRecipes"
                  :key="uniqId + recipe.value.Id"
                  @click="currentRecipeId = recipe.value.Id"
                >
                  <CardHeader>
                    <CardTitle>{{ recipe.value.Operation }}</CardTitle>
                    <CardDescription
                      >Running time :
                      {{
                        +recipe.value.Time * currentTree.quantity
                      }}s</CardDescription
                    >
                  </CardHeader>
                  <CardContent class="flex flex-col gap-2">
                    <div
                      v-for="[comp, amount] in recipe.inputs"
                      :key="uniqId + recipe.value.Id + comp.value.Id"
                    >
                      <Ingredient
                        :item="comp"
                        :quantity="amount * currentTree.quantity"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div v-else>
                <p>No recipe available for this item</p>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.all-available-recipes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  max-height: 100%;
  overflow-y: auto;
}
.active {
  border: 1px solid black;
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
