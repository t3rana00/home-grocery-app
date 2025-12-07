import { useState } from 'react';
import type { Bill } from '../types';
import './Bills.css';

interface BillsProps {
  isLoaded: boolean;
  onAddBill: (name: string, amount: number, dueDate: string) => void;
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
  const [formData, setFormData] = useState({ name: '', amount: '', dueDate: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.amount || !formData.dueDate) return;

    onAddBill(formData.name.trim(), parseFloat(formData.amount), formData.dueDate);
    setFormData({ name: '', amount: '', dueDate: '' });
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

  if (!isLoaded) return <div className="loading">Loading...</div>;

  const sortedBills = getBillsSorted();

  return (
    <div className="bills-container">
      <form className="add-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Bill name"
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
        <button type="submit" className="btn btn-primary">
          Add Bill
        </button>
      </form>

      {sortedBills.length === 0 ? (
        <div className="empty-state">
          <p>No bills yet</p>
          <p className="empty-subtitle">Add bills to track payments</p>
        </div>
      ) : (
        <div className="bills-list">
          {sortedBills.map((bill) => (
            <div
              key={bill.id}
              className={`bill-card ${bill.isPaid ? 'paid' : ''} ${isOverdue(bill) ? 'overdue' : ''}`}
            >
              <div className="bill-header">
                <h3 className="bill-name">{bill.name}</h3>
                {isOverdue(bill) && <span className="overdue-badge">OVERDUE</span>}
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
                  <span className="checkbox-label">
                    {bill.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
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
