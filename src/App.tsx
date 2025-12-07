import { useState } from 'react';
import type { Tab } from './types';
import { NavBar } from './components/NavBar';
import { MissingList } from './components/MissingList';
import { ShoppingListComponent } from './components/ShoppingList';
import { Bills } from './components/Bills';
import { useMissingItems, useShoppingList, useBills } from './hooks/useLocalStorage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('missing');

  // Missing items hook
  const missingItems = useMissingItems();

  // Shopping list hook
  const shoppingList = useShoppingList();

  // Bills hook
  const bills = useBills();

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏠 Home Grocery App</h1>
      </header>

      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-content">
        {activeTab === 'missing' && (
          <MissingList
            items={missingItems.items}
            isLoaded={missingItems.isLoaded}
            onAddItem={missingItems.addItem}
            onDeleteItem={missingItems.deleteItem}
            onAddShoppingItem={shoppingList.addFromMissing}
          />
        )}

        {activeTab === 'shopping' && (
          <ShoppingListComponent
            items={shoppingList.items}
            isLoaded={shoppingList.isLoaded}
            onAddItem={shoppingList.addItem}
            onToggleItem={shoppingList.toggleItem}
            onDeleteItem={shoppingList.deleteItem}
            onClearDone={shoppingList.clearDoneItems}
          />
        )}

        {activeTab === 'bills' && (
          <Bills
            isLoaded={bills.isLoaded}
            onAddBill={bills.addBill}
            onToggleBillStatus={bills.toggleBillStatus}
            onDeleteBill={bills.deleteBill}
            isOverdue={bills.isOverdue}
            getBillsSorted={bills.getBillsSorted}
          />
        )}
      </main>
    </div>
  );
}

export default App;
