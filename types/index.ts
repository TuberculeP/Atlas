import type {
  GameItemModel,
  ProcessorItemDetails,
} from "assistantapps-nomanssky-info";

export interface GComponent {
  value: GameItemModel;
  from_recipe: GRecipe[];
  for_recipe: GRecipe[];
}

export type GRecipeComponent = [GComponent, number];

export interface GRecipe {
  value: ProcessorItemDetails;
  output: GRecipeComponent;
  inputs: GRecipeComponent[];
}

export interface WayWithDetails {
  steps: GRecipe[];
  requirements: [GComponent, number][];
}

export type RecursiveTree = {
  node_id: string;
  item: GComponent;
  quantity: number;
  in_inventory?: boolean;
  to_find?: boolean;
  subs?: RecursiveTree[];
};
