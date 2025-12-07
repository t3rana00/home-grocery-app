import { useState } from 'react';
import type { ShoppingItem } from '../types';
import './ShoppingList.css';

interface ShoppingListProps {
  items: ShoppingItem[];
  isLoaded: boolean;
  onAddItem: (name: string, category?: string) => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearDone: () => void;
}

export function ShoppingListComponent({
  items,
  isLoaded,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onClearDone,
}: ShoppingListProps) {
  const [formData, setFormData] = useState({ name: '', category: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onAddItem(formData.name.trim(), formData.category.trim() || undefined);
    setFormData({ name: '', category: '' });
  };

  const doneCount = items.filter((item) => item.isDone).length;
  const hasDoneItems = doneCount > 0;

  if (!isLoaded) return <div className="loading">Loading...</div>;

  return (
    <div className="shopping-list-container">
      <form className="add-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Item to buy"
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
          <button type="submit" className="btn btn-primary">
            Add Item
          </button>
        </div>
      </form>

      {hasDoneItems && (
        <button className="btn btn-clear-done" onClick={onClearDone}>
          Clear Bought Items ({doneCount})
        </button>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <p>No items on shopping list</p>
          <p className="empty-subtitle">Add items or move them from "Missing at Home"</p>
        </div>
      ) : (
        <div className="items-list">
          {items.map((item) => (
            <div key={item.id} className={`shopping-item ${item.isDone ? 'done' : ''}`}>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={item.isDone}
                  onChange={() => onToggleItem(item.id)}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
              </label>
              <div className="item-content">
                <span className="item-name">{item.name}</span>
                {item.category && <span className="item-category">{item.category}</span>}
              </div>
              <button
                className="btn btn-danger"
                onClick={() => onDeleteItem(item.id)}
                title="Delete"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
