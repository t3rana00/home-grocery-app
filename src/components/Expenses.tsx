import { useState } from 'react';
import type { Expense } from '../types';
import { Calculator } from './Calculator';
import './Expenses.css';

interface ExpensesProps {
  expenses: Expense[];
  isLoaded: boolean;
  onAddExpense: (
    description: string,
    amount: number,
    category: string,
    date: string,
    paidBy: string
  ) => void;
  onDeleteExpense: (id: string) => void;
  payers: { id: string; name: string }[];
  isPayersLoaded: boolean;
  onAddPayer: (name: string) => Promise<void>;
}

export function Expenses({ expenses, isLoaded, onAddExpense, onDeleteExpense, payers, isPayersLoaded, onAddPayer }: ExpensesProps) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    paidBy: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [newPayer, setNewPayer] = useState('');
  const [showAddPayer, setShowAddPayer] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [showCalculator, setShowCalculator] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.amount || !formData.date) return;
    if (!formData.paidBy || formData.paidBy === '__add_new__') return;

    onAddExpense(
      formData.description.trim(),
      parseFloat(formData.amount),
      formData.category.trim(),
      formData.date,
      formData.paidBy.trim() || 'Unknown'
    );
    setFormData({
      description: '',
      amount: '',
      category: '',
      paidBy: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleAddPayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayer.trim()) return;
    await onAddPayer(newPayer.trim());
    setFormData((prev) => ({ ...prev, paidBy: newPayer.trim() }));
    setNewPayer('');
    setShowAddPayer(false);
  };

  // Filter expenses by selected month
  const filteredExpenses = expenses.filter((expense) => {
    return expense.date.startsWith(selectedMonth);
  });

  // Calculate total for selected month
  const monthTotal = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Totals by payer
  const totalsByPayer = filteredExpenses.reduce<Record<string, number>>((acc, expense) => {
    const payer = expense.paidBy || 'Unknown';
    acc[payer] = (acc[payer] || 0) + expense.amount;
    return acc;
  }, {});

  // Get unique months from expenses
  const availableMonths = Array.from(
    new Set(expenses.map((expense) => expense.date.slice(0, 7)))
  ).sort((a, b) => b.localeCompare(a));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatMonth = (monthString: string) => {
    const date = new Date(monthString + '-01');
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (!isLoaded || !isPayersLoaded) return <div className="loading">Loading...</div>;

  return (
    <div className="expenses-container">
      <form className="add-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Expense description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-input"
            required
          />
        </div>
        <div className="form-row">
          <input
            type="number"
            placeholder="Amount"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="Category (optional)"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="form-row">
          <select
            value={formData.paidBy}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '__add_new__') {
                setShowAddPayer(true);
                setFormData({ ...formData, paidBy: '' });
              } else {
                setShowAddPayer(false);
                setFormData({ ...formData, paidBy: value });
              }
            }}
            className="form-input"
            required
          >
            <option value="">Select who paid</option>
            {payers.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
            <option value="__add_new__">+ Add new payer</option>
          </select>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="form-input"
            required
          />
          <button type="submit" className="btn btn-primary">
            Add Expense
          </button>
        </div>
      </form>

      {showAddPayer && (
        <form className="add-payer-inline" onSubmit={handleAddPayer}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Add payer name (e.g., Husband, Wife)"
              value={newPayer}
              onChange={(e) => setNewPayer(e.target.value)}
              className="form-input"
              required
            />
            <button type="submit" className="btn btn-primary">
              Save payer
            </button>
          </div>
        </form>
      )}

      {/* Month selector */}
      <div className="month-selector">
        <label htmlFor="month-select">View Month:</label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="month-select"
        >
          {availableMonths.length > 0 ? (
            availableMonths.map((month) => (
              <option key={month} value={month}>
                {formatMonth(month)}
              </option>
            ))
          ) : (
            <option value={selectedMonth}>{formatMonth(selectedMonth)}</option>
          )}
        </select>
      </div>

      {/* Total for selected month */}
      <div className="month-total">
        <h3>{formatMonth(selectedMonth)} Total</h3>
        <div className="total-amount">{formatCurrency(monthTotal)}</div>
      </div>

      {/* Totals by person */}
      {Object.keys(totalsByPayer).length > 0 && (
        <div className="payer-totals">
          <h3>Expenses by Person</h3>
          <div className="payer-totals-list">
            {Object.entries(totalsByPayer).map(([payer, total]) => (
              <div key={payer} className="payer-total-card">
                <span className="payer-name">{payer}</span>
                <span className="payer-amount">{formatCurrency(total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses for {formatMonth(selectedMonth)}</p>
          <p className="empty-subtitle">Add your daily expenses to track spending</p>
        </div>
      ) : (
        <div className="expenses-list">
          {filteredExpenses.map((expense) => (
            <div key={expense.id} className="expense-card">
              <div className="expense-date">{formatDate(expense.date)}</div>
              <div className="expense-content">
                <div className="expense-header">
                  <h4 className="expense-description">{expense.description}</h4>
                  <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                </div>
                <div className="expense-meta">
                  <span className="expense-payer">Paid by: {expense.paidBy || 'Unknown'}</span>
                  {expense.category && (
                    <span className="expense-category">{expense.category}</span>
                  )}
                </div>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => onDeleteExpense(expense.id)}
                title="Delete"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        className="floating-calculator-btn"
        onClick={() => setShowCalculator(true)}
        title="Open Calculator"
      >
        🧮
      </button>

      {showCalculator && (
        <Calculator
          onCalculate={(result) => {
            setFormData({ ...formData, amount: result.toFixed(2) });
          }}
          onClose={() => setShowCalculator(false)}
        />
      )}
    </div>
  );
}
