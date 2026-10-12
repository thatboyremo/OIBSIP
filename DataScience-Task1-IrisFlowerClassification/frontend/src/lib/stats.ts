export function mean(a: number[]): number { return a.reduce((s, x) => s + x, 0) / a.length; }
/** Sample standard deviation (n-1), same convention as pandas. */
export function std(a: number[]): number { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); }
export function pearson(x: number[], y: number[]): number {
  const mx = mean(x), my = mean(y); let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < x.length; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
  return sxy / Math.sqrt(sxx * syy);
}
export function correlationMatrix(cols: number[][]): number[][] { return cols.map((a) => cols.map((b) => pearson(a, b))); }
