import { useState, useEffect } from 'react';
import { Navbar, Loader, Pagination } from '../components';
import { getPredictions } from '../services'; // Ensure this service method supports pagination
import { formatCurrency, formatMonth } from '../utils';

export function PredictionsPage() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isColdStart, setIsColdStart] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Assuming getPredictions now takes page/size or params
    // If getLatestPredictions was used, we might need a new service method or update it
    import('../services').then(s => {
      // Backend default size is 20 usually, but can check API
      s.getPredictions({ page: currentPage, size: 10 })
        .then((res) => {
          const data = res.data || res;
          // Handle Spring Data Page structure if strictly returned, or list
          if (data.content) {
            setPredictions(data.content);
            setTotalPages(data.totalPages);
            setIsColdStart(data.content.every(p => p.confidenceScore <= 0.2));
          } else if (Array.isArray(data)) {
            setPredictions(data);
            setTotalPages(1);
            setIsColdStart(data.every(p => p.confidenceScore <= 0.2));
          }
        })
        .catch(() => setPredictions([]))
        .finally(() => setLoading(false));
    });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-main transition-colors duration-300">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-main">AI Predictions</h1>
          <p className="text-text-secondary mt-1">Forecasted spending for upcoming months.</p>
        </div>

        {loading ? (
          <Loader className="min-h-[40vh] flex items-center justify-center" />
        ) : predictions.length === 0 ? (
          <div className="text-center py-16 card">
            <p className="text-text-secondary text-lg">No predictions available yet.</p>
          </div>
        ) : (
          <>
            {isColdStart && (
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <div>
                  <h3 className="text-blue-800 dark:text-blue-300 font-medium">Getting Started</h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                    We don't have enough transaction history yet, so these are <strong>estimated baselines</strong>.
                    As you track your income and expenses, these predictions will become personalized and highly accurate.
                  </p>
                </div>
              </div>
            )}

            <div className="card overflow-hidden p-0 mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-bg-primary border-b border-border-color">
                    <tr>
                      <th className="text-left text-text-secondary font-medium px-6 py-4">Month</th>
                      <th className="text-left text-text-secondary font-medium px-6 py-4">Category</th>
                      <th className="text-right text-text-secondary font-medium px-6 py-4">Predicted Amount</th>
                      <th className="text-right text-text-secondary font-medium px-6 py-4">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color">
                    {predictions.map((p, index) => (
                      <tr key={index} className="hover:bg-bg-primary/50 transition-colors">
                        <td className="px-6 py-4 text-text-main font-medium">{formatMonth(p.targetMonth)}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full bg-bg-primary text-xs font-medium text-text-secondary border border-border-color">
                            {p.categoryName}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-accent-primary">
                          {formatCurrency(p.predictedAmount)}
                        </td>
                        <td className="px-6 py-4 text-right text-text-secondary">
                          {p.confidenceScore != null ? (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${p.confidenceScore > 0.8 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                              p.confidenceScore > 0.5 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                                'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                              }`}>
                              {p.confidenceScore <= 0.2 ? 'Estimate' : `${Number(p.confidenceScore * 100).toFixed(0)}%`}
                            </span>
                          ) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
