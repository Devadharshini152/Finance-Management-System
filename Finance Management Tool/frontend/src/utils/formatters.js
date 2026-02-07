import { format, parseISO } from 'date-fns';

export const formatCurrency = (value) => {
  if (value == null) return '—';
  const n = Number(value);

  let locale = 'en-US';
  let currency = 'USD';
  try {
    const saved = localStorage.getItem('currency_preference');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.code) {
        currency = parsed.code;
        locale = parsed.locale || 'en-US';
      }
    }
  } catch (e) {
    console.warn("Error parsing currency prefs", e);
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
};

export const formatDate = (d) => {
  if (!d) return '—';
  const date = typeof d === 'string' ? parseISO(d.split('T')[0]) : d;
  return format(date, 'MMM d, yyyy');
};

export const formatMonth = (ym) => {
  if (!ym) return '—';
  const [year, month] = String(ym).split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return format(date, 'MMMM yyyy');
};
