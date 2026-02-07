import { useState, useEffect } from 'react';
import { Navbar, Loader, SmartBudgetModal, BudgetFormModal } from '../components';
import { getBudgetStatus } from '../services';
import { formatCurrency } from '../utils';

export function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSmartModal, setShowSmartModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const load = () => {
    setLoading(true);
    getBudgetStatus()
      .then((res) => setBudgets(res.data || res || []))
      .catch(() => setBudgets([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  return (
    <div className="min-h-screen bg-bg-primary text-text-main transition-colors duration-300">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-text-main">Budgets</h1>
          <div className="flex gap-3">
            <button
              onClick={() => { setEditingBudget(null); setShowFormModal(true); }}
              className="btn-secondary flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2001/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              Add Budget
            </button>
            <button
              onClick={() => setShowSmartModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2001/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.753 6.753 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
                <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 002.322-.446z" />
              </svg>
              Smart Recommendations
            </button>
          </div>
        </div>

        {showSmartModal && (
          <SmartBudgetModal
            onClose={() => setShowSmartModal(false)}
            onApplied={() => { setShowSmartModal(false); load(); }}
          />
        )}

        {showFormModal && (
          <BudgetFormModal
            budget={editingBudget}
            onClose={() => setShowFormModal(false)}
            onSaved={() => { setShowFormModal(false); load(); }}
          />
        )}

        {loading ? (
          <Loader className="min-h-[40vh] flex items-center justify-center" />
        ) : budgets.length === 0 ? (
          <div className="text-center py-16 card">
            <p className="text-text-secondary text-lg">No budgets set for this month.</p>
            <p className="text-sm text-text-secondary mt-2">Budgets help you track spending limits per category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((b) => {
              const pct = Number(b.limitAmount) ? (Number(b.spentAmount || 0) / Number(b.limitAmount)) * 100 : 0;
              const colorClass = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500';
              const textColorClass = pct >= 100 ? 'text-red-500' : pct >= 80 ? 'text-amber-500' : 'text-emerald-500';

              return (
                <div key={b.id} className="card hover:-translate-y-1 relative group">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingBudget(b); setShowFormModal(true); }}
                      className="p-1 text-text-secondary hover:text-accent-primary"
                    >
                      <svg xmlns="http://www.w3.org/2001/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-text-main">{b.categoryName}</span>
                    <span className={`text-sm font-bold ${textColorClass}`}>
                      {Math.min(pct, 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-text-secondary mb-2">
                    <span>Spent: {formatCurrency(b.spentAmount)}</span>
                    <span>Limit: {formatCurrency(b.limitAmount)}</span>
                  </div>

                  <div className="h-3 bg-bg-primary rounded-full overflow-hidden border border-border-color">
                    <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
