export const SPECIES = ["setosa", "versicolor", "virginica"] as const;
export type Species = (typeof SPECIES)[number];
export const COLORS: Record<Species, string> = { setosa: "#8b7cf6", versicolor: "#38bdf8", virginica: "#f472b6" };
export const FIELDS = [
  { key: "sepal_length", label: "Sepal length" }, { key: "sepal_width", label: "Sepal width" },
  { key: "petal_length", label: "Petal length" }, { key: "petal_width", label: "Petal width" },
] as const;
export type Measurements = Record<(typeof FIELDS)[number]["key"], number>;
