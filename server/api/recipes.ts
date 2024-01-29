import { GameItemModel, GameItemService } from "assistantapps-nomanssky-info";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  console.log(query, query.output, typeof query.output)
  return await new GameItemService().getProcessorsByOutput("Refinery", query.output);
});
