import raw from "../data/iris.json";
import { SPECIES, type Species } from "./species";
// Rows come from sklearn.datasets.load_iris() (exported by scripts/export_artifacts.py).
export const ROWS = (raw.rows as number[][]).map((r, i) => ({
  id: i + 1, sepal_length: r[0], sepal_width: r[1], petal_length: r[2], petal_width: r[3], species: SPECIES[r[4]] as Species,
}));
// Example profiles are real observations: the first row of each species (indices 0, 50, 100).
export const EXAMPLES = SPECIES.map((s) => ROWS.find((r) => r.species === s)!);
