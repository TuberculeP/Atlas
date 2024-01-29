import { GameItemModel, GameItemService } from "assistantapps-nomanssky-info";

export default defineEventHandler(async () => {
  return await new GameItemService().getProcessorListfromJson("Refinery");
});
