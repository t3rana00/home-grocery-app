import { useState } from 'react';
import type { Bill } from '../types';
import './Bills.css';

interface BillsProps {
  isLoaded: boolean;
  onAddBill: (name: string, amount: number, dueDate: string, isRecurring: boolean) => void;
  onToggleBillStatus: (id: string) => void;
  onDeleteBill: (id: string) => void;
  isOverdue: (bill: Bill) => boolean;
  getBillsSorted: () => Bill[];
}

export function Bills({
  isLoaded,
  onAddBill,
  onToggleBillStatus,
  onDeleteBill,
  isOverdue,
  getBillsSorted,
}: BillsProps) {
  const [formData, setFormData] = useState({ 
    name: '', 
    amount: '', 
    dueDate: '',
    isRecurring: true 
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [showPaidBills, setShowPaidBills] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.amount || !formData.dueDate) return;

    onAddBill(
      formData.name.trim(),
      parseFloat(formData.amount),
      formData.dueDate,
      formData.isRecurring
    );
    setFormData({
      name: '',
      amount: '',
      dueDate: '',
      isRecurring: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatMonth = (monthString: string) => {
    const date = new Date(monthString + '-01');
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (!isLoaded) return <div className="loading">Loading...</div>;

  const sortedBills = getBillsSorted();

  // Filter bills by selected month
  const filteredBills = sortedBills.filter((bill) => {
    const billMonth = bill.dueDate.slice(0, 7);
    const matchesMonth = billMonth === selectedMonth;
    const matchesFilter = showPaidBills || !bill.isPaid;
    return matchesMonth && matchesFilter;
  });

  // Get unique months from bills
  const availableMonths = Array.from(
    new Set(sortedBills.map((bill) => bill.dueDate.slice(0, 7)))
  ).sort((a, b) => b.localeCompare(a));

  // Calculate totals for selected month
  const monthTotal = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidTotal = filteredBills
    .filter((bill) => bill.isPaid)
    .reduce((sum, bill) => sum + bill.amount, 0);
  const unpaidTotal = filteredBills
    .filter((bill) => !bill.isPaid)
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="bills-container">
      <form className="add-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Bill name (e.g., Electricity, Phone, Rent)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="recurring-checkbox">
            <input
              type="checkbox"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
            />
            <span>📅 Monthly recurring bill</span>
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Bill
        </button>
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

      {/* Filter toggle */}
      <div className="filter-toggle">
        <button
          className={`filter-btn ${showPaidBills ? 'active' : ''}`}
          onClick={() => setShowPaidBills(!showPaidBills)}
        >
          {showPaidBills ? '✓ Show Paid Bills' : '✕ Hide Paid Bills'}
        </button>
      </div>

      {/* Month totals */}
      <div className="bills-summary">
        <div className="summary-card total">
          <div className="summary-label">Total Bills</div>
          <div className="summary-amount">{formatCurrency(monthTotal)}</div>
        </div>
        <div className="summary-card paid">
          <div className="summary-label">Paid</div>
          <div className="summary-amount">{formatCurrency(paidTotal)}</div>
        </div>
        <div className="summary-card unpaid">
          <div className="summary-label">Unpaid</div>
          <div className="summary-amount">{formatCurrency(unpaidTotal)}</div>
        </div>
      </div>

      {filteredBills.length === 0 ? (
        <div className="empty-state">
          <p>No bills for {formatMonth(selectedMonth)}</p>
          <p className="empty-subtitle">
            {showPaidBills
              ? 'Add bills to track monthly payments'
              : 'No unpaid bills this month'}
          </p>
        </div>
      ) : (
        <div className="bills-list">
          {filteredBills.map((bill) => (
            <div
              key={bill.id}
              className={`bill-card ${bill.isPaid ? 'paid' : ''} ${isOverdue(bill) ? 'overdue' : ''}`}
            >
              <div className="bill-header">
                <div className="bill-title-row">
                  <h3 className="bill-name">{bill.name}</h3>
                  {bill.isRecurring && <span className="recurring-badge">📅 Monthly</span>}
                </div>
                {isOverdue(bill) && <span className="overdue-badge">OVERDUE</span>}
                {bill.isPaid && bill.paidDate && (
                  <span className="paid-badge">Paid on {formatDate(bill.paidDate)}</span>
                )}
              </div>
              <div className="bill-details">
                <div className="bill-amount">{formatCurrency(bill.amount)}</div>
                <div className="bill-due-date">Due: {formatDate(bill.dueDate)}</div>
              </div>
              <div className="bill-actions">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={bill.isPaid}
                    onChange={() => onToggleBillStatus(bill.id)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">{bill.isPaid ? 'Paid' : 'Mark as Paid'}</span>
                </label>
                <button
                  className="btn btn-danger"
                  onClick={() => onDeleteBill(bill.id)}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
