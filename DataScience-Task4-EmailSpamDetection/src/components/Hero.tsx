export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-navy-500/20 rounded-full blur-3xl" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: text */}
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
            <span className="text-sm font-medium text-accent-300">NLP-Powered Detection</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            Detect Spam.
            <br />
            <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              Stay Safe.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-navy-200 leading-relaxed mb-8 max-w-xl">
            This project uses natural language processing and machine learning to analyze text
            messages and identify whether they are spam or legitimate. Powered by TF-IDF
            vectorization and two trained classification models.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#detector"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-accent-500 text-navy-950 font-bold text-lg hover:bg-accent-400 transition-all hover:shadow-xl hover:shadow-accent-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              Try the Detector
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-navy-600 text-navy-100 font-semibold text-lg hover:border-accent-500/50 hover:text-accent-400 transition-all"
            >
              How It Works
            </a>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 mt-12 pt-8 border-t border-navy-700/50">
            <div>
              <div className="text-3xl font-bold text-white">2</div>
              <div className="text-sm text-navy-300">ML Models</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">TF-IDF</div>
              <div className="text-sm text-navy-300">Vectorization</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">Real-time</div>
              <div className="text-sm text-navy-300">Predictions</div>
            </div>
          </div>
        </div>

        {/* Right: image collage */}
        <div className="relative hidden lg:block animate-fade-in">
          <div className="relative grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-navy-700/50 shadow-2xl shadow-navy-950/50">
                <img
                  src="https://images.pexels.com/photos/5473956/pexels-photo-5473956.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="AI and digital code concept"
                  className="w-full h-48 object-cover"
                  loading="eager"
                />
              </div>
              <div className="rounded-2xl overflow-hidden border border-navy-700/50 shadow-2xl shadow-navy-950/50">
                <img
                  src="https://images.pexels.com/photos/17483870/pexels-photo-17483870.png?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Neural network visualization"
                  className="w-full h-36 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="rounded-2xl overflow-hidden border border-navy-700/50 shadow-2xl shadow-navy-950/50">
                <img
                  src="https://images.pexels.com/photos/18069490/pexels-photo-18069490.png?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="AI data visualization"
                  className="w-full h-36 object-cover"
                  loading="lazy"
                />
              </div>
              <div className="rounded-2xl overflow-hidden border border-navy-700/50 shadow-2xl shadow-navy-950/50">
                <img
                  src="https://images.pexels.com/photos/5474035/pexels-photo-5474035.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Cybersecurity concept"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Floating accent badge */}
          <div className="absolute -bottom-4 -left-4 bg-navy-800/95 backdrop-blur-sm border border-accent-500/30 rounded-xl px-5 py-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Protected by AI</div>
                <div className="text-xs text-navy-300">Spam classification engine</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
