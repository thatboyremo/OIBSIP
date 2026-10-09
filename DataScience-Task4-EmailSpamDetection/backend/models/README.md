# Place your trained model files here

You need to upload these four files into this directory:

1. **naive_bayes_model.pkl** — Your trained Multinomial Naive Bayes model
2. **logistic_regression_model.pkl** — Your trained Logistic Regression model
3. **tfidf_vectorizer.pkl** — Your fitted TF-IDF vectorizer
4. **preprocessing.py** — Your text preprocessing module

The backend will automatically load these files when it starts. Make sure:

- `preprocessing.py` exports a function that takes a string and returns a preprocessed string. The backend looks for a function named one of: `preprocess_text`, `preprocess`, `clean_text`, `transform_text`, or `normalize_text`.
- The `.pkl` files were saved using `pickle` (or `joblib`) and are compatible with the scikit-learn version in `requirements.txt`.
- The models support `predict_proba()` for confidence scores (both MultinomialNB and LogisticRegression do by default).

If a file is missing, the API will return a 503 error with a clear message explaining which file is missing.
