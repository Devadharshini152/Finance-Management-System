import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState('USD');
    const [locale, setLocale] = useState('en-US');

    useEffect(() => {
        const saved = localStorage.getItem('currency_preference');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setCurrency(parsed.code);
                setLocale(parsed.locale);
            } catch (e) {
                console.error("Failed to parse currency settings", e);
            }
        }
    }, []);

    const updateCurrency = (code, loc) => {
        setCurrency(code);
        setLocale(loc);
        localStorage.setItem('currency_preference', JSON.stringify({ code, locale: loc }));
        // Force reload to update non-reactive formatters if necessary, 
        // or we rely on the context being used. 
        // For a smoother experience, we'll try to use context where possible.
    };

    const format = (amount) => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    return (
        <CurrencyContext.Provider value={{ currency, locale, updateCurrency, format }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    return useContext(CurrencyContext);
}
