import { GameItemService } from "assistantapps-nomanssky-info";

export default defineEventHandler(
  async () => await new GameItemService().getAllItemDetails()
);
