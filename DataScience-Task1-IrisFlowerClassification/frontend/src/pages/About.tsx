import type { ReactNode } from "react";
import { Card, Title } from "../components/ui";
import Pipeline from "../components/Pipeline";

const P = ({ children }: { children: ReactNode }) => <p className="max-w-3xl text-sm leading-relaxed text-muted">{children}</p>;
export default function About() {
  return (<>
    <Title sub="A portfolio project that connects a trained scikit-learn classifier to a working web application.">About Iris AI Studio</Title>
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Purpose"><P>Iris AI Studio lets you enter four flower measurements, get a prediction from a saved machine learning model through a real API, and explore the dataset and the model's evaluation results.</P></Card>
      <Card title="Dataset"><P>The standard Iris dataset from scikit-learn: 150 observations, 50 each of setosa, versicolor and virginica, with no missing values. The four input features are sepal length, sepal width, petal length and petal width, all in centimetres.</P></Card>
      <Card title="Preprocessing and model"><P>The data was split 80/20 with a stratified split and random_state 42, giving 120 training and 30 test rows. A StandardScaler was fitted on the training rows only. The saved classifier is a scikit-learn LogisticRegression (max_iter 200) trained on the scaled training data, and it provides class probabilities. The scaler and model are stored as iris_scaler.pkl and iris_model.pkl and are only loaded by the backend.</P></Card>
      <Card title="Evaluation approach"><P>Test-set metrics describe how the model performed on the 30 held-out rows from the notebook split. The Model Evaluation page also compares K-Nearest Neighbours (k=5) from the same notebook, refit on the same training rows because only the Logistic Regression was saved. Evaluation results are regenerated and checked against the saved files by scripts/export_artifacts.py.</P></Card>
      <Card title="Test evaluation versus live predictions"><P>The test-set metrics are fixed results from one held-out sample. A live prediction is a single output for the numbers you type in. One live prediction, or a set of them, does not measure accuracy, and the predicted probabilities are model estimates rather than guarantees.</P></Card>
      <Card title="Limitations"><P>Iris is a small educational benchmark. With only 30 test rows, each misclassification changes accuracy by about 3.3 percentage points, and strong results here do not show that the approach is ready for other classification problems. The model only knows these three species, so a measurement from any other flower will still be assigned to one of them.</P></Card>
      <Card title="Technology"><P>Frontend: React, TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion, Lucide icons. Backend: Python, FastAPI, Pydantic, scikit-learn, joblib. Tests: pytest, Vitest and React Testing Library.</P></Card>
    </div>
    <div className="mt-6"><Pipeline /></div>
  </>);
}
