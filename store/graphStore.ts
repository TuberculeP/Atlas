import type {
  GameItemModel,
  ProcessorItemDetails,
} from "assistantapps-nomanssky-info";
import { defineStore } from "pinia";
import type {
  GComponent,
  GRecipeComponent,
  GRecipe,
  WayWithDetails,
} from "~/types";
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
  private findRequirementsFromWay(way: GRecipe[]): [GComponent, number][] {
    const requirements: [GComponent, number][] = [];
    [...way].reverse().forEach(({ inputs, output }) => {
      const [outputComponent, quantity] = output;
      const outputComponentIdx = requirements.findIndex(
        ([c]) => c === outputComponent
      );
      let outputQuantity = 0;
      if (outputComponentIdx === -1) {
        requirements.push([outputComponent, quantity]);
        outputQuantity = quantity;
      } else {
        outputQuantity = requirements[outputComponentIdx][1];
        requirements[outputComponentIdx][1] = 0;
      }
      const ratio = Math.ceil(outputQuantity / quantity);

      inputs.forEach(([inputComponent, inputQuantity]) => {
        const inputComponentIdx = requirements.findIndex(
          ([c]) => c === inputComponent
        );
        // ajouter input * quantity à requirements
        if (inputComponentIdx !== -1) {
          requirements[inputComponentIdx][1] += inputQuantity * ratio;
        } else {
          requirements.push([inputComponent, inputQuantity * ratio]);
        }
      });
    });
    // retirer 1 x output de requirements
    const finalOutput = way[way.length - 1].output;
    const finalOutputIdx = requirements.findIndex(
      ([c]) => c === finalOutput[0]
    );
    requirements[finalOutputIdx][1] -= finalOutput[1];
    return requirements.filter(([, quantity]) => quantity !== 0);
  }
  public findWays(component: GComponent): WayWithDetails[] {
    const ways = this.findWaysRaw(component);
    return ways.map((way) => ({
      steps: way,
      requirements: this.findRequirementsFromWay(way),
    }));
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
    const outputComponent = graph.get(recipe.Output.Id);
    if (!outputComponent) return;
    const output: GRecipeComponent = [outputComponent, recipe.Output.Quantity];
    if (!output || !output[0]) return;
    // ajouter la recette à from_recipe de l'output, en vérifiant d'abord que la recette n'est pas déjà présente
    if (output[0].from_recipe.some((r) => r.value.Id === recipe.Id)) return;
    if (recipe.Inputs.some(({ Id }) => !graph.has(Id))) return;
    const recipeForGraph: GRecipe = {
      value: recipe,
      output,
      inputs: recipe.Inputs.map(({ Id, Quantity }) => [
        graph.get(Id),
        Quantity,
      ]) as GRecipeComponent[],
    };
    output[0].from_recipe.push(recipeForGraph);
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

  const test = {
    paraffinium: graph.get("raw24"),
  };

  return {
    graph,
    getWaysDetail,
    test,
  };
});
