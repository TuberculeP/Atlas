import type {
  GameItemModel,
  ProcessorItemDetails,
} from "assistantapps-nomanssky-info";

export interface GComponent {
  value: GameItemModel;
  from_recipe: GRecipe[];
  for_recipe: GRecipe[];
}

export type GRecipeComponent = [GComponent, number]

export interface GRecipe {
  value: ProcessorItemDetails;
  output: GComponent;
  inputs: GRecipeComponent[];
}
