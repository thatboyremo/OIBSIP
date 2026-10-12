import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import Predictor, { validate } from "./pages/Predictor";
import { EvaluationView } from "./pages/Evaluation";
import { validateEvaluation } from "./services/evaluation";
import { ThemeProvider } from "./lib/theme";
import { pearson, std } from "./lib/stats";
import Heatmap, { CORR } from "./components/Heatmap";
import About from "./pages/About";

afterEach(() => vi.restoreAllMocks());
const wrap = (ui: JSX.Element) => render(<ThemeProvider><MemoryRouter>{ui}</MemoryRouter></ThemeProvider>);

describe("app", () => {
  it("renders main navigation and opens mobile menu", () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("x")));
    wrap(<App />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Open menu"));
    expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
  });
  it("validates inputs", () => {
    expect(validate({ sepal_length: "", sepal_width: "abc", petal_length: "99", petal_width: "1" })).toMatchObject({ sepal_length: expect.any(String), sepal_width: expect.any(String), petal_length: expect.any(String) });
  });
  it("loads an example into the form", () => {
    wrap(<Predictor />); fireEvent.click(screen.getByText("setosa"));
    expect((screen.getByLabelText(/Petal length/) as HTMLInputElement).value).toBe("1.4");
  });
  it("renders the API result", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ prediction: "virginica", prediction_index: 2, probabilities: { setosa: 0.1, versicolor: 0.2, virginica: 0.7 }, model_name: "T" }) }));
    wrap(<Predictor />); fireEvent.click(screen.getByText("virginica")); fireEvent.click(screen.getByText("Predict species"));
    await waitFor(() => expect(screen.getByText("Iris virginica")).toBeInTheDocument());
    expect(screen.getByText("70.00%")).toBeInTheDocument();
  });
  it("shows an error when the API fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fail")));
    wrap(<Predictor />); fireEvent.click(screen.getByText("setosa")); fireEvent.click(screen.getByText("Predict species"));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/Cannot reach the API/));
  });
  it("handles missing evaluation", () => {
    wrap(<EvaluationView ev={null} />); expect(screen.getByText("Evaluation results not configured")).toBeInTheDocument();
    expect(validateEvaluation({ nope: true })).toBeNull();
  });
  it("navigation lists all eight pages", () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("x")));
    wrap(<App />);
    for (const n of ["Overview", "Live Predictor", "Species Explorer", "Dataset Explorer", "Model Evaluation", "Prediction History", "Settings", "About"]) expect(screen.getByRole("link", { name: n })).toBeInTheDocument();
  });
  it("toggles and persists the theme", () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("x")));
    wrap(<App />);
    const before = document.documentElement.dataset.theme;
    fireEvent.click(screen.getAllByRole("button", { name: /Switch to/ })[0]);
    expect(document.documentElement.dataset.theme).not.toBe(before);
    expect(localStorage.getItem("iris-theme")).toBe(document.documentElement.dataset.theme);
  });
  it("computes Pearson correlation from the dataset", () => {
    expect(pearson([1, 2, 3], [2, 4, 6])).toBeCloseTo(1); expect(pearson([1, 2, 3], [3, 2, 1])).toBeCloseTo(-1);
    expect(std([1, 2, 3, 4])).toBeCloseTo(1.290994, 5);
    expect(CORR[0][0]).toBeCloseTo(1); expect(CORR[2][3]).toBeGreaterThan(0.9);
  });
  it("renders the heatmap and the about page", () => {
    wrap(<Heatmap />); expect(screen.getAllByRole("gridcell")).toHaveLength(16);
    wrap(<About />); expect(screen.getByText(/Test evaluation versus live predictions/)).toBeInTheDocument();
  });
});
