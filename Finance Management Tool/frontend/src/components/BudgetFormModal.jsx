import { useState, useEffect } from 'react';
import { createBudget, updateBudget, getExpenseCategories } from '../services';
import { toast } from 'react-toastify';
import { useCurrency } from '../context';

export function BudgetFormModal({ budget, onClose, onSaved }) {
    const { currency, locale } = useCurrency();
    const [categories, setCategories] = useState([]);
    const [symbol, setSymbol] = useState('$');

    useEffect(() => {
        // Get symbol from Intl
        try {
            const parts = new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).formatToParts(0);
            const sym = parts.find(part => part.type === 'currency')?.value || '$';
            setSymbol(sym);
        } catch (e) {
            setSymbol('$');
        }
    }, [currency, locale]);

    const [formData, setFormData] = useState({
        categoryId: '',
        limitAmount: '',
        budgetMonth: new Date().toISOString().slice(0, 7) // YYYY-MM
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getExpenseCategories().then(res => setCategories(res.data || res));
        if (budget) {
            setFormData({
                categoryId: budget.categoryId,
                limitAmount: budget.limitAmount,
                budgetMonth: budget.budgetMonth.toString()
            });
        }
    }, [budget]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (budget) {
                await updateBudget(budget.id, formData);
                toast.success('Budget updated');
            } else {
                await createBudget(formData);
                toast.success('Budget created');
            }
            onSaved();
        } catch (err) {
            console.error(err);
            toast.error('Failed to save budget');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="relative inline-block align-bottom bg-bg-surface rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-border-color">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-bg-surface px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-text-main mb-4" id="modal-title">
                                {budget ? 'Edit Budget' : 'New Budget'}
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-text-secondary">Category</label>
                                    <select
                                        id="category"
                                        required
                                        disabled={!!budget} // Cannot change category on edit usually, or keep simple
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className="input-field mt-1 block w-full"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="limit" className="block text-sm font-medium text-text-secondary">Limit Amount</label>
                                    <div className="relative mt-1 rounded-md shadow-sm">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="text-text-secondary sm:text-sm">{symbol}</span>
                                        </div>
                                        <input
                                            type="number"
                                            name="limit"
                                            id="limit"
                                            required
                                            min="1"
                                            step="0.01"
                                            value={formData.limitAmount}
                                            onChange={(e) => setFormData({ ...formData, limitAmount: e.target.value })}
                                            className="input-field block w-full !pl-12"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="month" className="block text-sm font-medium text-text-secondary">Month</label>
                                    <input
                                        type="month"
                                        id="month"
                                        required
                                        value={formData.budgetMonth}
                                        onChange={(e) => setFormData({ ...formData, budgetMonth: e.target.value })}
                                        className="input-field mt-1 block w-full"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-bg-surface px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-border-color">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-accent-primary text-base font-medium text-white hover:bg-accent-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-border-color shadow-sm px-4 py-2 bg-bg-surface text-base font-medium text-text-main hover:bg-bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
