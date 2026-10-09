const cards = [
  {
    title: 'TF-IDF Vectorization',
    tag: 'Feature Extraction',
    description:
      'Term Frequency-Inverse Document Frequency (TF-IDF) converts text into numerical feature vectors. It weighs words by how often they appear in a message versus how common they are across all messages — so distinctive spam keywords like "winner" or "urgent" get higher scores.',
    points: ['Text to numbers', 'Word importance scoring', 'Sparse matrix output'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    title: 'Multinomial Naive Bayes',
    tag: 'Classification Model',
    description:
      "Naive Bayes is a probabilistic classifier based on Bayes' theorem. It assumes each word contributes independently to whether a message is spam. Despite its simplicity, it performs remarkably well on text classification tasks and is fast at inference time.",
    points: ['Bayes theorem', 'Word independence assumption', 'Fast inference'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16c2-4 5-4 7 0s5 4 7 0" />
      </svg>
    ),
  },
  {
    title: 'Logistic Regression',
    tag: 'Classification Model',
    description:
      'Logistic Regression models the probability that a message is spam using a logistic function applied to a weighted combination of TF-IDF features. It learns which words are most associated with spam and produces a confidence score for each prediction.',
    points: ['Weighted feature combination', 'Sigmoid probability output', 'Interpretable weights'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M3 17c4-12 14-12 18 0" />
        <circle cx="12" cy="8" r="1.5" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-accent-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-navy-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-700/50 border border-navy-600 mb-6">
            <span className="text-sm font-medium text-accent-300">How It Works</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            The Technology Behind Detection
          </h2>
          <p className="text-lg text-navy-300 max-w-2xl mx-auto">
            Three key components work together to transform raw text into accurate spam predictions.
          </p>
        </div>

        {/* Pipeline diagram */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 mb-16">
          <div className="px-5 py-3 rounded-xl bg-navy-800 border border-navy-600 text-navy-100 font-medium text-sm text-center">
            Raw Text Message
          </div>
          <svg className="w-6 h-6 text-navy-500 hidden md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <svg className="w-6 h-6 text-navy-500 md:hidden rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <div className="px-5 py-3 rounded-xl bg-navy-800 border border-accent-500/30 text-accent-300 font-medium text-sm text-center">
            Preprocessing + TF-IDF
          </div>
          <svg className="w-6 h-6 text-navy-500 hidden md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <svg className="w-6 h-6 text-navy-500 md:hidden rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <div className="px-5 py-3 rounded-xl bg-navy-800 border border-accent-500/30 text-accent-300 font-medium text-sm text-center">
            ML Model
          </div>
          <svg className="w-6 h-6 text-navy-500 hidden md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <svg className="w-6 h-6 text-navy-500 md:hidden rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <div className="px-5 py-3 rounded-xl bg-accent-500/10 border border-accent-500/50 text-accent-300 font-bold text-sm text-center">
            Spam or Not Spam
          </div>
        </div>

        {/* Three explanation cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div
              key={card.title}
              className="group relative bg-navy-800/40 border border-navy-700/50 rounded-2xl p-6 hover:border-accent-500/30 transition-all hover:shadow-xl hover:shadow-accent-500/5 animate-fade-in-up"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-400 mb-4 group-hover:bg-accent-500/20 transition-colors">
                <div className="w-6 h-6">{card.icon}</div>
              </div>

              <div className="text-xs font-medium text-accent-400 mb-2">{card.tag}</div>
              <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-sm text-navy-300 leading-relaxed mb-4">{card.description}</p>

              <div className="flex flex-wrap gap-2">
                {card.points.map((point) => (
                  <span
                    key={point}
                    className="text-xs px-2.5 py-1 rounded-full bg-navy-900/60 border border-navy-700/40 text-navy-300"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
