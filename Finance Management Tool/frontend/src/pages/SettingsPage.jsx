import { useState } from 'react';
import { Navbar, CategoryManager } from '../components';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { useCurrency } from '../context';
import { toast } from 'react-toastify';

export function SettingsPage() {
    const { currency, updateCurrency } = useCurrency();
    const [selected, setSelected] = useState(currency);
    const [showConfirm, setShowConfirm] = useState(false);
    const [activeTab, setActiveTab] = useState('preferences');

    const currencies = [
        { code: 'USD', locale: 'en-US', name: 'US Dollar ($)' },
        { code: 'INR', locale: 'en-IN', name: 'Indian Rupee (₹)' },
        { code: 'EUR', locale: 'de-DE', name: 'Euro (€)' },
        { code: 'GBP', locale: 'en-GB', name: 'British Pound (£)' },
        { code: 'JPY', locale: 'ja-JP', name: 'Japanese Yen (¥)' },
        { code: 'CAD', locale: 'en-CA', name: 'Canadian Dollar (CA$)' },
        { code: 'AUD', locale: 'en-AU', name: 'Australian Dollar (A$)' },
    ];

    const handleSave = () => {
        const target = currencies.find(c => c.code === selected);
        if (target) {
            updateCurrency(target.code, target.locale);
            toast.success('Currency updated');
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary text-text-main transition-colors duration-300">
            <Navbar />
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-text-main mb-8">Settings</h1>

                <div className="flex space-x-1 rounded-xl bg-bg-surface p-1 mb-8">
                    <button
                        onClick={() => setActiveTab('preferences')}
                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                            ${activeTab === 'preferences'
                                ? 'bg-bg-primary text-accent-primary shadow'
                                : 'text-text-secondary hover:text-text-main hover:bg-bg-primary/50'
                            }`}
                    >
                        Preferences
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                            ${activeTab === 'categories'
                                ? 'bg-bg-primary text-accent-primary shadow'
                                : 'text-text-secondary hover:text-text-main hover:bg-bg-primary/50'
                            }`}
                    >
                        Categories
                    </button>
                </div>

                {activeTab === 'preferences' ? (
                    <div className="card">
                        <h2 className="text-xl font-semibold mb-4">Preferences</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="currency" className="block text-sm font-medium text-text-secondary mb-2">Currency</label>
                                <select
                                    id="currency"
                                    value={selected}
                                    onChange={(e) => setSelected(e.target.value)}
                                    className="input-field w-full max-w-xs"
                                >
                                    {currencies.map(c => (
                                        <option key={c.code} value={c.code}>{c.name}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-text-secondary mt-2">This will update formatting across the application.</p>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    className="btn-primary"
                                    disabled={selected === currency}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <CategoryManager />
                )}

                <ConfirmationModal
                    // ... (keep modal same)
                    isOpen={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={handleSave}
                    title="Confirm Changes"
                    message={`Are you sure you want to change the currency to ${currencies.find(c => c.code === selected)?.name}? This will update how all amounts are displayed.`}
                    confirmText="Save"
                />
            </main>
        </div>
    );
}
