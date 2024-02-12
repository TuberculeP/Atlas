import type LeaderLine from "leader-line-new";
import { defineStore } from "pinia";

export const useGraphlineStore = defineStore({
  id: "myGraphlineStore",
  state: () => ({
    allLines: [],
  }),
  actions: {
    updateAllLines() {
      this.allLines.forEach((line: LeaderLine) => {
        line.position();
      });
    },
    addLine(line: LeaderLine) {
      this.allLines.push(line);
      this.updateAllLines();
    },
  },
});
