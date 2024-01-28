/**
 * @fileoverview
 * This file contains important types and data structures for the No Man's Sky
 * Graphical Resource Analysis project. It also contains some utility functions
 * that are used throughout the project.
 * 
 * @author TuberculeP (Typescript implementation)
 * @author RaphA (Graph theory & Algorithms)
 * 
 * @version 0.1.0
 * 
 * @copyright (c) TuberculeP RaphA
 * @license MIT
 */

import type { GComponent, GRecipe } from "./types";

export const hmap: Record<string, GComponent> = {};

export const logger = {
  enabled: false,
  log: (...args: any[]) => {
    if (logger.enabled) {
      console.log(...args);
    }
  },
};

export function findWays(
  { from_recipe: fr }: GComponent,
  vr: Set<GRecipe> = new Set()
): GRecipe[][] {
  if (fr.some((r) => vr.has(r))) return [];

  return fr.reduce<any>((tw, r) => {
    vr.add(r);
    const pw: GRecipe[][] = [];
    r.components.forEach(({ component }) => {
      pw.push(...findWays(component, vr));
    });

    pw.length ? pw.forEach((c) => c.push(r)) : pw.push([r]);

    return [...pw, ...tw];
  }, []);
}

export function createRecipe(
  outputName: string,
  amount: number,
  comps: [string, number][]
) {
  const recipe: GRecipe = {
    output: hmap[outputName],
    components: comps.map((c) => {
      return { component: hmap[c[0]], amount: c[1] };
    }),
    amount,
  };
  hmap[outputName].from_recipe.push(recipe);
  comps.forEach(([n, _]) => hmap[n].for_recipe.push(recipe));
}
