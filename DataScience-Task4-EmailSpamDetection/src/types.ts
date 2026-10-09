export interface PredictionResponse {
  label: string;
  is_spam: boolean;
  confidence: number;
  probabilities: {
    ham: number;
    spam: number;
  };
}

export interface PredictionError {
  error: string;
}
