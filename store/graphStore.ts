import type {
  GameItemModel,
  ProcessorItemDetails,
} from "assistantapps-nomanssky-info";
import { defineStore } from "pinia";
import type { GComponent, GRecipeComponent, GRecipe } from "~/types";
// le graphe est simplement un dictionnaire clé string valeur gcomponent
class Graph extends Map<string, GComponent> {
  constructor() {
    super();
  }
  public findWaysRaw(
    { from_recipe: fr }: GComponent,
    vr: Set<GRecipe> = new Set()
  ): GRecipe[][] {
    if (fr.some((r) => vr.has(r))) return [];

    return fr.reduce<any>((tw, r) => {
      vr.add(r);
      const pw: GRecipe[][] = [];
      r.inputs.forEach(([component]) => {
        pw.push(...this.findWaysRaw(component, vr));
      });

      pw.length ? pw.forEach((c) => c.push(r)) : pw.push([r]);

      return [...pw, ...tw];
    }, []);
  }
}

export const useGraphStore = defineStore("graphStore", () => {
  const graph = new Graph();
  const { data: allRecipes } = useAsyncData("allRecipes", () =>
    $fetch<ProcessorItemDetails[]>("/api/recipes")
  );
  const { data: allItems } = useAsyncData("allItems", () =>
    $fetch<GameItemModel[]>("/api/items")
  );

  allItems.value?.forEach((item: GameItemModel) => {
    graph.set(item.Id, {
      value: item,
      from_recipe: [],
      for_recipe: [],
    });
  });

  allRecipes.value?.forEach((recipe: ProcessorItemDetails) => {
    const output = graph.get(recipe.Output.Id);
    if (!output) return;
    // ajouter la recette à from_recipe de l'output, en vérifiant d'abord que la recette n'est pas déjà présente
    if (output.from_recipe.some((r) => r.value.Id === recipe.Id)) return;
    if (recipe.Inputs.some(({ Id }) => !graph.has(Id))) return;
    const recipeForGraph: GRecipe = {
      value: recipe,
      output,
      inputs: recipe.Inputs.map(({ Id, Quantity }) => [
        graph.get(Id),
        Quantity,
      ]) as GRecipeComponent[],
    };
    output.from_recipe.push(recipeForGraph);
    recipeForGraph.inputs.forEach(([component]) => {
      component.for_recipe.push(recipeForGraph);
    });
  });

  function getWaysDetail(ways: GRecipe[][]): Record<string, number>[] {
    return ways.map(
      (way: GRecipe[]): Record<string, number> => ({
        dummy: 0,
        foo: 1,
        bar: 1742,
      })
    );
  }

  return {
    graph,
    getWaysDetail,
  };
});
