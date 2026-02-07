import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';
import ThemeToggle from '../ThemeToggle';
import { AICommandBar } from './AICommandBar';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCommandBar, setShowCommandBar] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-bg-surface border-b border-border-color sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-accent-primary font-bold text-xl flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2001/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
              <span>FinTrack</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-1">
              {[
                { path: '/dashboard', label: 'Dashboard' },
                { path: '/transactions', label: 'Transactions' },
                { path: '/budgets', label: 'Budgets' },
                { path: '/predictions', label: 'Predictions' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                    ? 'bg-accent-primary text-white'
                    : 'text-text-secondary hover:bg-bg-primary hover:text-text-main'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCommandBar(true)}
              className="p-2 rounded-full text-text-secondary hover:text-accent-primary hover:bg-bg-primary transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary"
              title="AI Command Bar"
            >
              <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
            </button>
            <ThemeToggle />

            <div className="hidden md:flex items-center gap-4">
              <span className="text-text-main text-sm font-medium">{user?.name}</span>
              <Link
                to="/settings"
                className="text-text-secondary hover:text-accent-primary transition-colors text-sm font-medium"
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="text-text-secondary hover:text-accent-primary transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-bg-primary focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-bg-surface border-t border-border-color absolute w-full shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {[
              { path: '/dashboard', label: 'Dashboard' },
              { path: '/transactions', label: 'Transactions' },
              { path: '/budgets', label: 'Budgets' },
              { path: '/predictions', label: 'Predictions' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(item.path)
                  ? 'bg-accent-primary text-white'
                  : 'text-text-secondary hover:bg-bg-primary hover:text-text-main'
                  }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-border-color my-2"></div>
            <div className="px-3 py-2 text-text-secondary text-sm">
              Signed in as <span className="font-semibold text-text-main">{user?.email}</span>
            </div>
            <Link
              to="/settings"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-bg-primary hover:text-text-main"
            >
              Settings
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              Logout
            </button>
          </div>
        </div>
      )}
      <AICommandBar
        isOpen={showCommandBar}
        onClose={() => setShowCommandBar(false)}
        onTransactionSaved={() => { }}
      />
    </nav>
  );
}
