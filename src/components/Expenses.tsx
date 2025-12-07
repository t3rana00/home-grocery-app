import { useState } from 'react';
import type { Expense } from '../types';
import { Calculator } from './Calculator';
import './Expenses.css';

interface ExpensesProps {
  expenses: Expense[];
  isLoaded: boolean;
  onAddExpense: (description: string, amount: number, category: string, date: string) => void;
  onDeleteExpense: (id: string) => void;
}

export function Expenses({ expenses, isLoaded, onAddExpense, onDeleteExpense }: ExpensesProps) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [showCalculator, setShowCalculator] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.amount || !formData.date) return;

    onAddExpense(
      formData.description.trim(),
      parseFloat(formData.amount),
      formData.category.trim(),
      formData.date
    );
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  // Filter expenses by selected month
  const filteredExpenses = expenses.filter((expense) => {
    return expense.date.startsWith(selectedMonth);
  });

  // Calculate total for selected month
  const monthTotal = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

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

  if (!isLoaded) return <div className="loading">Loading...</div>;

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
          <div className="amount-input-wrapper">
            <input
              type="number"
              placeholder="Amount"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="form-input"
              required
            />
            <button
              type="button"
              className="calculator-btn"
              onClick={() => setShowCalculator(true)}
              title="Open Calculator"
            >
              🧮
            </button>
          </div>
          <input
            type="text"
            placeholder="Category (optional)"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="form-row">
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
                {expense.category && (
                  <span className="expense-category">{expense.category}</span>
                )}
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
