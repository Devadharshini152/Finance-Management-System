import { Link } from 'react-router-dom';
import { useAuth } from '../context';
import ThemeToggle from '../components/ThemeToggle';

export function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-bg-primary text-text-main flex flex-col transition-colors duration-300">
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2001/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-accent-primary">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
          <span className="text-xl font-bold text-text-main">FinTrack</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-accent-primary to-purple-600 bg-clip-text text-transparent pb-2">
          Master Your Finances
        </h1>
        <p className="text-text-secondary text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
          AI-powered tracking for income, expenses, and budgets. Get intelligent predictions and gain full control over your financial future.
        </p>

        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/login"
              className="btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-center"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 rounded-lg border-2 border-border-color text-text-main font-semibold hover:border-accent-primary hover:text-accent-primary transition-colors text-center bg-bg-surface shadow-sm"
            >
              Register
            </Link>
          </div>
        )}

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
          <FeatureCard
            title="Track"
            desc="Effortlessly log income and expenses."
            icon={
              <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-emerald-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <FeatureCard
            title="Budget"
            desc="Set limits and monitor adherence."
            icon={
              <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
              </svg>
            }
          />
          <FeatureCard
            title="Predict"
            desc="AI forecast for the next 6 months."
            icon={
              <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            }
          />
        </div>
      </main>

      <footer className="p-6 text-center text-text-secondary text-sm border-t border-border-color">
        © {new Date().getFullYear()} FinTrack. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="card hover:-translate-y-1">
      <div className="bg-bg-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-border-color">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-text-main">{title}</h3>
      <p className="text-text-secondary">{desc}</p>
    </div>
  );
}
