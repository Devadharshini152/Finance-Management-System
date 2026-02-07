import { useState, useEffect } from 'react';
import { Navbar, TransactionForm, Loader, Pagination } from '../components';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import {
  getTransactions,
  deleteTransaction,
  getExpenseCategories,
  getIncomeCategories,
} from '../services';
import { formatCurrency, formatDate } from '../utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function TransactionsPage() {
  const [data, setData] = useState({ content: [], totalPages: 0, number: 0 });
  const [categories, setCategories] = useState({ expense: [], income: [] });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const load = (p = 0) => {
    setLoading(true);
    Promise.all([
      getTransactions({ page: p, size: pageSize, sort: 'transactionDate,desc' }),
      getExpenseCategories(),
      getIncomeCategories()
    ])
      .then(([txRes, expRes, incRes]) => {
        setData(txRes.data || txRes);
        setCategories({ expense: expRes.data || expRes, income: incRes.data || incRes });
        setPage(p);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load transactions');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => load(0), []);

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteTransaction(deleteId)
      .then(() => { toast.success('Deleted'); load(page); })
      .catch(() => toast.error('Delete failed'))
      .finally(() => setDeleteId(null));
  };

  const list = Array.isArray(data?.content) ? data.content : [];

  return (
    <div className="min-h-screen bg-bg-primary text-text-main transition-colors duration-300">
      <Navbar />
      <ToastContainer position="top-right" theme="colored" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-main">Transactions</h1>
            <p className="text-text-secondary mt-1">Manage your income and expenses.</p>
          </div>
          <button
            onClick={() => { setEditingId(null); setShowForm(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2001/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            Add Transaction
          </button>
        </div>

        {showForm && (
          <TransactionForm
            categories={categories}
            editingId={editingId}
            onClose={() => { setShowForm(false); setEditingId(null); }}
            onSaved={() => { setShowForm(false); setEditingId(null); load(page); toast.success('Saved'); }}
          />
        )}

        {loading && list.length === 0 ? (
          <Loader className="min-h-[40vh] flex items-center justify-center" />
        ) : list.length === 0 ? (
          <div className="text-center py-16 card">
            <p className="text-text-secondary text-lg">No transactions yet.</p>
            <p className="text-sm text-text-secondary mt-2">Start by adding a new transaction.</p>
          </div>
        ) : (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-primary border-b border-border-color">
                  <tr>
                    <th className="text-left text-text-secondary font-medium px-6 py-4">Date</th>
                    <th className="text-left text-text-secondary font-medium px-6 py-4">Description</th>
                    <th className="text-left text-text-secondary font-medium px-6 py-4">Category</th>
                    <th className="text-right text-text-secondary font-medium px-6 py-4">Amount</th>
                    <th className="text-right text-text-secondary font-medium px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {list.map((t) => (
                    <tr key={t.id} className="hover:bg-bg-primary/50 transition-colors">
                      <td className="px-6 py-4 text-text-main whitespace-nowrap">{formatDate(t.transactionDate)}</td>
                      <td className="px-6 py-4 text-text-main font-medium">{t.description || '—'}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full bg-bg-primary text-xs font-medium text-text-secondary border border-border-color">
                          {t.categoryName}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-semibold ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => { setEditingId(t.id); setShowForm(true); }}
                          className="text-text-secondary hover:text-accent-primary mr-3 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(t.id)}
                          className="text-text-secondary hover:text-red-500 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={(p) => load(p)}
            />
          </div>
        )}
        <ConfirmationModal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          title="Delete Transaction"
          message="Are you sure you want to delete this transaction? This action cannot be undone."
          confirmText="Delete"
          isDangerous={true}
        />
      </main>
    </div>
  );
}
