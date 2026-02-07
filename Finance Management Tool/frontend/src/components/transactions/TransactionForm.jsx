import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createTransaction, updateTransaction, getTransaction } from '../../services';
import { format } from 'date-fns';
import { useCurrency } from '../../context';

export function TransactionForm({ categories, editingId, onClose, onSaved, initialData }) {
  const { currency, locale } = useCurrency();
  const [symbol, setSymbol] = useState('$');

  useEffect(() => {
    try {
      const parts = new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).formatToParts(0);
      const sym = parts.find(part => part.type === 'currency')?.value || '$';
      setSymbol(sym);
    } catch (e) { setSymbol('$'); }
  }, [currency, locale]);

  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: initialData || {
      amount: '',
      type: 'EXPENSE',
      categoryId: '',
      description: '',
      transactionDate: format(new Date(), 'yyyy-MM-dd'),
      isRecurring: false
    }
  });

  const type = watch('type');
  const catList = type === 'INCOME' ? (categories?.income || []) : (categories?.expense || []);

  useEffect(() => {
    if (editingId) {
      getTransaction(editingId).then((res) => {
        const d = res.data || res;
        if (d) {
          setValue('amount', d.amount);
          setValue('type', d.type);
          setValue('categoryId', d.categoryId);
          setValue('description', d.description || '');
          setValue('transactionDate', (d.transactionDate || '').slice(0, 10));
          setValue('isRecurring', d.isRecurring || false);
        }
      });
    } else {
      // Reset category if list changes
      if (catList.length > 0) setValue('categoryId', catList[0].id);
    }
  }, [editingId, type, catList.length]);

  const onSubmit = (data) => {
    setLoading(true);
    const payload = {
      amount: Number(data.amount),
      type: data.type,
      categoryId: Number(data.categoryId),
      description: data.description || null,
      transactionDate: data.transactionDate,
      isRecurring: Boolean(data.isRecurring)
    };

    (editingId ? updateTransaction(editingId, payload) : createTransaction(payload))
      .then(() => onSaved())
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-surface rounded-xl max-w-md w-full p-6 border border-border-color shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-main"
        >
          <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-text-main mb-6">
          {editingId ? 'Edit Transaction' : 'New Transaction'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-text-secondary text-sm font-medium mb-1">Type</label>
            <div className="grid grid-cols-2 gap-2">
              <label className={`cursor-pointer text-center py-2 rounded-lg border transition-all ${type === 'EXPENSE' ? 'bg-red-500 text-white border-red-500' : 'bg-bg-primary text-text-secondary border-border-color hover:border-red-400'}`}>
                <input type="radio" value="EXPENSE" {...register('type')} className="hidden" />
                Expense
              </label>
              <label className={`cursor-pointer text-center py-2 rounded-lg border transition-all ${type === 'INCOME' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-bg-primary text-text-secondary border-border-color hover:border-emerald-400'}`}>
                <input type="radio" value="INCOME" {...register('type')} className="hidden" />
                Income
              </label>
            </div>
          </div>

          <div>
            <label className="block text-text-secondary text-sm font-medium mb-1">Category</label>
            <select
              {...register('categoryId', { required: true })}
              className="input-field"
            >
              {catList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-text-secondary text-sm font-medium mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">{symbol}</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                {...register('amount', { required: true, min: 0.01 })}
                className="input-field !pl-12"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-text-secondary text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              {...register('transactionDate', { required: true })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-sm font-medium mb-1">Description (Optional)</label>
            <input
              {...register('description')}
              className="input-field"
              placeholder="e.g. Weekly Groceries"
            />
          </div>

          <div className="pt-2 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-text-secondary hover:bg-bg-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
