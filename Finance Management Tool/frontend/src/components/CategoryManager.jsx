
import { useState, useEffect } from 'react';
import { getIncomeCategories, getExpenseCategories, createCategory, updateCategory, deleteCategory } from '../services';
import { toast } from 'react-toastify';
import { ConfirmationModal } from './common/ConfirmationModal';

export function CategoryManager() {
    const [categories, setCategories] = useState({ income: [], expense: [] });
    const [type, setType] = useState('EXPENSE'); // 'INCOME' or 'EXPENSE'
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [name, setName] = useState('');

    // Delete Confirmation
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [inc, exp] = await Promise.all([getIncomeCategories(), getExpenseCategories()]);
            setCategories({
                income: inc.data || inc,
                expense: exp.data || exp
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (item = null) => {
        setEditItem(item);
        setName(item ? item.name : '');
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = { name, type };
            if (editItem) {
                await updateCategory(editItem.id, payload);
                toast.success('Category updated');
            } else {
                await createCategory(payload);
                toast.success('Category created');
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save category');
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteCategory(deleteId);
            toast.success('Category deleted');
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete (Category might be in use)');
        } finally {
            setDeleteId(null);
        }
    };

    const currentList = type === 'INCOME' ? categories.income : categories.expense;

    return (
        <div className="card mt-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Custom Categories</h2>
                <button
                    onClick={() => handleOpen()}
                    className="btn-primary flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Category
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b border-border-color">
                <button
                    className={`pb-2 px-4 ${type === 'EXPENSE' ? 'border-b-2 border-accent-primary text-accent-primary font-medium' : 'text-text-secondary hover:text-text-main'}`}
                    onClick={() => setType('EXPENSE')}
                >
                    Expense
                </button>
                <button
                    className={`pb-2 px-4 ${type === 'INCOME' ? 'border-b-2 border-accent-primary text-accent-primary font-medium' : 'text-text-secondary hover:text-text-main'}`}
                    onClick={() => setType('INCOME')}
                >
                    Income
                </button>
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {currentList.map(cat => (
                        <div key={cat.id} className="flex items-center justify-between p-3 bg-bg-primary rounded-md border border-border-color group">
                            <span className="font-medium text-text-main">{cat.name}</span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!cat.isSystem ? (
                                    <>
                                        <button onClick={() => handleOpen(cat)} className="text-text-secondary hover:text-accent-primary">
                                            <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                        <button onClick={() => setDeleteId(cat.id)} className="text-text-secondary hover:text-red-500">
                                            <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-xs text-text-muted bg-bg-surface px-2 py-0.5 rounded border border-border-color">System</span>
                                )}
                            </div>
                        </div>
                    ))}
                    {currentList.length === 0 && (
                        <div className="col-span-full text-center text-text-secondary">No custom categories yet.</div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block w-full overflow-hidden text-left align-bottom transition-all transform bg-bg-surface rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-md border border-border-color">
                            <div className="px-4 pt-5 pb-4 bg-bg-surface sm:p-6 sm:pb-4">
                                <h3 className="text-lg font-medium leading-6 text-text-main mb-4">
                                    {editItem ? 'Edit Category' : `New ${type === 'INCOME' ? 'Income' : 'Expense'} Category`}
                                </h3>
                                <form onSubmit={handleSave}>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                                        <input
                                            type="text"
                                            className="input-field w-full"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                        <button type="submit" className="w-full btn-primary sm:col-start-2">
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 w-full btn-secondary sm:mt-0 sm:col-start-1"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? This action cannot be undone."
                confirmText="Delete"
            />
        </div>
    );
}
