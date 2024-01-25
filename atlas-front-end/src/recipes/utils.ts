export interface GComponent {
  name: string;
  from_recipe: GRecipe[];
  for_recipe: GRecipe[];
  basic?: boolean;
}

export interface GComponentForRecipe {
  component: GComponent;
  amount: number;
}

export interface GRecipe {
  time?: number;
  //...
  components: GComponentForRecipe[];
  output: GComponent;
  amount: number;
}

const hmap: Record<string, GComponent> = {};

export const createHmap = () => ({ hmap });

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
