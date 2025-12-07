import { useState } from 'react';
import type { MissingItem } from '../types';
import './MissingList.css';

interface MissingListProps {
  items: MissingItem[];
  isLoaded: boolean;
  onAddItem: (name: string, category?: string, note?: string) => void;
  onDeleteItem: (id: string) => void;
  onAddShoppingItem: (item: MissingItem) => void;
}

export function MissingList({
  items,
  isLoaded,
  onAddItem,
  onDeleteItem,
  onAddShoppingItem,
}: MissingListProps) {
  const [formData, setFormData] = useState({ name: '', category: '', note: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onAddItem(
      formData.name.trim(),
      formData.category.trim() || undefined,
      formData.note.trim() || undefined
    );
    setFormData({ name: '', category: '', note: '' });
  };

  const handleMoveToShopping = (item: MissingItem) => {
    onAddShoppingItem(item);
    onDeleteItem(item.id);
  };

  if (!isLoaded) return <div className="loading">Loading...</div>;

  return (
    <div className="missing-list-container">
      <form className="add-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Item name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
            required
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Category (optional)"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Note (optional)"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="form-input"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Item
        </button>
      </form>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>No missing items yet</p>
          <p className="empty-subtitle">Add items you notice are missing at home</p>
        </div>
      ) : (
        <div className="items-list">
          {items.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-content">
                <h3 className="item-name">{item.name}</h3>
                {item.category && <span className="item-category">{item.category}</span>}
                {item.note && <p className="item-note">{item.note}</p>}
              </div>
              <div className="item-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleMoveToShopping(item)}
                  title="Move to shopping list"
                >
                  →
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDeleteItem(item.id)}
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
