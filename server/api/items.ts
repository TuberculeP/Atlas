import { GameItemModel, GameItemService } from "assistantapps-nomanssky-info";

export default defineEventHandler(async () =>
  (await new GameItemService().getAllItemDetails()).filter(
    ({ Usages }: GameItemModel) =>
      !!Usages &&
      (Usages.includes("HasRefinedUsing") ||
        Usages.includes("HasRefinedToCreate"))
  )
);
