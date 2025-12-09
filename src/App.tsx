import { useState } from 'react';
import type { Tab } from './types';
import { NavBar } from './components/NavBar';
import { MissingList } from './components/MissingList';
import { ShoppingListComponent } from './components/ShoppingList';
import { Bills } from './components/Bills';
import { Expenses } from './components/Expenses';
import { Login } from './components/Login';
// Using Firebase for cloud storage with real-time sync
import {
  useFirebaseMissingItems as useMissingItems,
  useFirebaseShoppingList as useShoppingList,
  useFirebaseBills as useBills,
  useFirebaseExpenses as useExpenses,
  useFirebasePayers as usePayers,
  useUserProfile,
} from './firebase/firebaseHooks';
import { useAuth } from './firebase/AuthContext';
// Uncomment below to use localStorage instead:
// import { useMissingItems, useShoppingList, useBills, useExpenses } from './hooks/useLocalStorage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('missing');
  const { user, isLoading, logout } = useAuth();
  
  // Call all hooks before any conditionals
  const missingItems = useMissingItems(user?.uid || 'guest');
  const shoppingList = useShoppingList(user?.uid || 'guest');
  const bills = useBills(user?.uid || 'guest');
  const expenses = useExpenses(user?.uid || 'guest');
  const payers = usePayers(user?.uid || 'guest');
  const { userName } = useUserProfile(user?.uid || null);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <Login onLoginSuccess={() => {}} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏠 Home Grocery App</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>Welcome, {userName || 'User'}</span>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Logout
          </button>
        </div>
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
            payers={payers.payers}
            isPayersLoaded={payers.isLoaded}
            onAddPayer={async (name: string) => {
              await payers.addPayer(name);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
