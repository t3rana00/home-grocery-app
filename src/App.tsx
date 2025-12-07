import { useState } from 'react';
import type { Tab } from './types';
import { NavBar } from './components/NavBar';
import { MissingList } from './components/MissingList';
import { ShoppingListComponent } from './components/ShoppingList';
import { Bills } from './components/Bills';
import { Expenses } from './components/Expenses';
// Using Firebase for cloud storage with real-time sync
import {
  useFirebaseMissingItems as useMissingItems,
  useFirebaseShoppingList as useShoppingList,
  useFirebaseBills as useBills,
  useFirebaseExpenses as useExpenses,
} from './firebase/firebaseHooks';
// Uncomment below to use localStorage instead:
// import { useMissingItems, useShoppingList, useBills, useExpenses } from './hooks/useLocalStorage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('missing');

  // Using 'guest' user - replace with actual user ID after adding authentication
  const missingItems = useMissingItems('guest');
  const shoppingList = useShoppingList('guest');
  const bills = useBills('guest');
  const expenses = useExpenses('guest');

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

        {activeTab === 'expenses' && (
          <Expenses
            expenses={expenses.expenses}
            isLoaded={expenses.isLoaded}
            onAddExpense={expenses.addExpense}
            onDeleteExpense={expenses.deleteExpense}
          />
        )}
      </main>
    </div>
  );
}

export default App;
