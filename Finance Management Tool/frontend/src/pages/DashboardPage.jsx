import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Loader } from '../components';
import { getDashboardOverview } from '../services';
import { formatCurrency } from '../utils';
import { useTheme } from '../context';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    getDashboardOverview()
      .then((res) => res.data && setData(res.data))
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        <Loader className="min-h-[60vh] flex items-center justify-center" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        <div className="p-6 text-center">
          <p className="text-red-500 bg-red-50 dark:bg-red-900/10 p-4 rounded-lg inline-block border border-red-200 dark:border-red-800">
            {error || 'No data available'}
          </p>
        </div>
      </div>
    );
  }

  const pieData = (data.spendingByCategory || []).map((c) => ({ name: c.categoryName || 'Other', value: Number(c.amount) }));
  const trendData = (data.monthlyTrends || []).map((t) => ({
    month: t.month,
    income: Number(t.income),
    expenses: Number(t.expenses),
  }));

  // Chart styles based on theme
  const axisColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
    borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
    color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-main transition-colors duration-300">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-main">Dashboard</h1>
            <p className="text-text-secondary mt-1">Make data-driven financial decisions.</p>
          </div>
          <Link
            to="/transactions"
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2001/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            Add Transaction
          </Link>
        </div>

        {/* Alerts Section */}
        {data.alerts && data.alerts.length > 0 && (
          <div className="mb-8 space-y-3">
            {data.alerts.map((alert, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200">
                <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mt-0.5 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <div className="text-sm font-medium">{alert}</div>
              </div>
            ))}
          </div>
        )}

        {/* Financial Health Widget */}
        <FinancialHealthWidget />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Income"
            value={formatCurrency(data.totalIncome)}
            type="income"
            icon={
              <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-emerald-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(data.totalExpenses)}
            type="expense"
            icon={
              <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            }
          />
          <StatCard
            title="Net Savings"
            value={formatCurrency(data.netSavings)}
            type={Number(data.netSavings) >= 0 ? 'good' : 'bad'}
            icon={
              <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${Number(data.netSavings) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            }
          />
          <StatCard
            title="Financial Health"
            value={`${data.financialHealthScore ?? 0}/100`}
            type="neutral"
            icon={
              <svg xmlns="http://www.w3.org/2001/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            }
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-text-main mb-6">Income vs Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <XAxis dataKey="month" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={axisColor} fontSize={12} tickFormatter={(v) => `$${v}`} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(v) => [formatCurrency(v), '']}
                />
                <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-text-main mb-6">Spending by Category</h2>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke={theme === 'dark' ? '#1e293b' : '#ffffff'} strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrency(v)} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(val) => <span className="text-text-secondary ml-1">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-text-secondary">
                No spending data this month
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, type, icon }) {
  let valueColor = 'text-text-main';
  if (type === 'income' || type === 'good') valueColor = 'text-emerald-500';
  if (type === 'expense' || type === 'bad') valueColor = 'text-red-500';

  return (
    <div className="card flex items-start justify-between">
      <div>
        <p className="text-text-secondary text-sm font-medium">{title}</p>
        <p className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</p>
      </div>
      <div className="p-3 bg-bg-primary rounded-full">
        {icon}
      </div>
    </div>
  );
}

function FinancialHealthWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../services').then(s => {
      s.getFinancialHealthScore().then(res => {
        setData(res.data || res);
      }).catch(err => console.error(err)).finally(() => setLoading(false));
    });
  }, []);

  if (loading || !data) return null;

  const color = data.score >= 80 ? 'text-emerald-500' : data.score >= 60 ? 'text-amber-500' : 'text-red-500';
  const bg = data.score >= 80 ? 'bg-emerald-500' : data.score >= 60 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="card mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-main">Financial Health</h2>
          <p className="text-text-secondary text-sm mt-1">{data.suggestion}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className={`text-2xl font-bold ${color}`}>{data.score}/100</div>
            <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold">{data.status}</div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-bg-primary flex items-center justify-center relative bg-bg-secondary">
            <div className={`absolute inset-0 rounded-full opacity-20 ${bg}`}></div>
            <svg xmlns="http://www.w3.org/2001/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-8 h-8 ${color} relative z-10`}>
              <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
