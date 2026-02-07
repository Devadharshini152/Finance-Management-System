
import { useState, useEffect } from 'react';
import { parseTransaction } from '../../services';
import { TransactionForm } from '../transactions/TransactionForm';
import { getIncomeCategories, getExpenseCategories } from '../../services';
import { toast } from 'react-toastify';

export function AICommandBar({ isOpen, onClose, onTransactionSaved }) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [parsedData, setParsedData] = useState(null);
    const [categories, setCategories] = useState({ income: [], expense: [] });

    useEffect(() => {
        if (isOpen) {
            Promise.all([getIncomeCategories(), getExpenseCategories()])
                .then(([inc, exp]) => {
                    setCategories({ income: inc.data || inc, expense: exp.data || exp });
                });
        }
    }, [isOpen]);

    const handleParse = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        try {
            const result = await parseTransaction(input);
            console.log("NLP Result:", result);

            // Map result to form data structure
            let catId = '';
            let type = 'EXPENSE';

            const allCats = [...categories.expense, ...categories.income];
            const matchedCat = (result.category) ?
                (allCats.find(c => c.name.toLowerCase() === result.category.toLowerCase())
                    || allCats.find(c => c.name.toLowerCase().includes(result.category.toLowerCase())))
                : null
                || categories.expense.find(c => c.name === 'Other Expense');

            if (matchedCat) {
                catId = matchedCat.id;
                const isIncome = categories.income.some(c => c.id === catId);
                type = isIncome ? 'INCOME' : 'EXPENSE';
            }

            setParsedData({
                amount: result.amount,
                description: result.description,
                transactionDate: result.date,
                categoryId: catId,
                type: type,
                isRecurring: false,
                reason: result.reason // Store reason for display
            });

        } catch (err) {
            console.error(err);
            toast.error('Failed to understand. Try "Lunch 20"');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <div className="relative bg-bg-surface rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:max-w-xl sm:w-full border border-border-color">

                    {!parsedData ? (
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-text-main">AI Quick Add</h3>
                                <button onClick={onClose} className="text-text-secondary hover:text-text-main">
                                    <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleParse}>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-accent-primary">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="input-field pl-10 py-3 text-lg w-full"
                                        placeholder="E.g., Dinner at Italian Place $45"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="submit"
                                            disabled={loading || !input.trim()}
                                            className="bg-accent-primary text-white rounded-md p-1.5 hover:bg-accent-secondary disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-text-secondary text-left">
                                    Try: <span className="text-accent-primary font-medium">"20 groceries yesterday"</span> or <span className="text-accent-primary font-medium">"Uber 15"</span>
                                </p>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-bg-primary">
                            <TransactionForm
                                categories={categories}
                                initialData={parsedData}
                                onClose={() => { setParsedData(null); onClose(); }}
                                onSaved={() => {
                                    toast.success('Transaction Saved!');
                                    setParsedData(null);
                                    onClose();
                                    if (onTransactionSaved) onTransactionSaved();
                                }}
                            />
                            {parsedData.reason && (
                                <div className="px-6 pb-4 bg-bg-surface text-center">
                                    <span className="text-xs text-text-secondary bg-bg-primary px-3 py-1 rounded-full border border-border-color">
                                        🤖 AI Reason: {parsedData.reason}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
