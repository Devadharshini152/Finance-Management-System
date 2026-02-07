import { useState, useEffect } from 'react';
import { getBudgetRecommendations, getBudgetStatus, createBudget } from '../services'; // Import getBudgetStatus
import { formatCurrency } from '../utils';
import { toast } from 'react-toastify';

export function SmartBudgetModal({ onClose, onApplied }) {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState({});
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        const date = new Date();
        const currentMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        Promise.all([
            getBudgetRecommendations(),
            getBudgetStatus(currentMonth) // Fetch existing budgets
        ])
            .then(([recRes, budgetRes]) => {
                const recData = recRes.data || recRes || [];
                const budgetData = budgetRes.data || budgetRes || [];

                // Create a set of category IDs that have existing budgets
                const existingCategoryIds = new Set(budgetData.map(b => b.categoryId));

                // Filter recommendations: Exclude those that already have a budget
                // OR we could keep them but uncheck them? User request implies removing "once added".
                // Filtering is cleaner for "Add Smart Budgets".
                const filteredRecs = recData.filter(r => !existingCategoryIds.has(r.categoryId));

                setRecommendations(filteredRecs);

                // Select all remaining by default
                const initialSel = {};
                filteredRecs.forEach(r => initialSel[r.categoryId] = true);
                setSelected(initialSel);
            })
            .catch((err) => {
                console.error(err);
                toast.error('Failed to load recommendations');
            })
            .finally(() => setLoading(false));
    }, []);

    const toggle = (id) => {
        setSelected(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const apply = async () => {
        setApplying(true);
        const date = new Date();
        // Format YYYY-MM
        const currentMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        const toApply = recommendations.filter(r => selected[r.categoryId]);
        let successCount = 0;

        for (const rec of toApply) {
            try {
                await createBudget({
                    categoryId: rec.categoryId,
                    limitAmount: rec.recommendedLimit,
                    budgetMonth: currentMonth
                });
                successCount++;
            } catch (err) {
                console.error(`Failed to apply budget for ${rec.categoryName}`, err);
            }
        }

        setApplying(false);
        if (successCount > 0) {
            toast.success(`Applied ${successCount} smart budgets!`);
            onApplied();
        } else if (toApply.length > 0) {
            toast.error('Failed to apply budgets. They might already exist.');
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="relative inline-block align-bottom bg-bg-surface rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-border-color">
                    <div className="bg-bg-surface px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-accent-primary/20 sm:mx-0 sm:h-10 sm:w-10">
                                <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-text-main" id="modal-title">
                                    Smart Budget Recommendations
                                </h3>
                                <div className="mt-2 text-sm text-text-secondary">
                                    <p className="mb-4">AI analyzed your last 3 months of spending. Here are recommended budgets to help you save 10%:</p>

                                    {loading ? (
                                        <div className="py-8 text-center">Loading insights...</div>
                                    ) : recommendations.length === 0 ? (
                                        <p>No enough data to generate recommendations yet.</p>
                                    ) : (
                                        <div className="max-h-60 overflow-y-auto space-y-2">
                                            {recommendations.map(rec => (
                                                <div key={rec.categoryId} className="flex items-center justify-between p-3 rounded-md bg-bg-primary border border-border-color">
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!selected[rec.categoryId]}
                                                            onChange={() => toggle(rec.categoryId)}
                                                            className="h-4 w-4 rounded border-border-color text-accent-primary focus:ring-accent-primary"
                                                        />
                                                        <div className="text-left">
                                                            <div className="font-medium text-text-main">{rec.categoryName}</div>
                                                            <div className="text-xs text-text-secondary">Avg: {formatCurrency(rec.currentAverage)} • {rec.reason}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-accent-primary">{formatCurrency(rec.recommendedLimit)}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-bg-surface px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-border-color">
                        <button
                            type="button"
                            disabled={applying || loading || recommendations.length === 0}
                            onClick={apply}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-accent-primary text-base font-medium text-white hover:bg-accent-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                            {applying ? 'Applying...' : 'Apply Selected'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-border-color shadow-sm px-4 py-2 bg-bg-surface text-base font-medium text-text-main hover:bg-bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
