export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-navy-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-7 h-7 text-accent-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span className="text-lg font-bold text-white">
                SpamGuard<span className="text-accent-500">AI</span>
              </span>
            </div>
            <p className="text-sm text-navy-400 leading-relaxed max-w-xs">
              An NLP-powered machine learning project for detecting spam messages using TF-IDF
              vectorization and classification models.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Technology</h4>
            <ul className="space-y-2 text-sm text-navy-400">
              <li>TF-IDF Vectorization</li>
              <li>Multinomial Naive Bayes</li>
              <li>Logistic Regression</li>
              <li>FastAPI Backend</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-navy-400">
              <li>
                <a href="#detector" className="hover:text-accent-400 transition-colors">
                  Detector
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-accent-400 transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-navy-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-navy-500">
            Built with React, TypeScript, Tailwind CSS, and FastAPI. An educational ML project.
          </p>
          <p className="text-xs text-navy-500">No data is stored. Predictions are processed in real-time.</p>
        </div>
      </div>
    </footer>
  )
}
