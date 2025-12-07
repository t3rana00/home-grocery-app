import { useState, useEffect } from 'react';
import type { MissingItem, ShoppingItem, Bill, Expense } from '../types';

const STORAGE_KEYS = {
  missingItems: 'missingItems',
  shoppingList: 'shoppingList',
  bills: 'bills',
  expenses: 'expenses',
};

export function useMissingItems() {
  const [items, setItems] = useState<MissingItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.missingItems);
    setItems(stored ? JSON.parse(stored) : []);
    setIsLoaded(true);
  }, []);

  const saveItems = (newItems: MissingItem[]) => {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEYS.missingItems, JSON.stringify(newItems));
  };

  const addItem = (name: string, category?: string, note?: string) => {
    const newItem: MissingItem = {
      id: Date.now().toString(),
      name,
      category,
      note,
      createdAt: Date.now(),
    };
    saveItems([...items, newItem]);
    return newItem;
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter(item => item.id !== id));
  };

  const moveToShopping = (item: MissingItem) => {
    deleteItem(item.id);
    return item;
  };

  return { items, isLoaded, addItem, deleteItem, moveToShopping };
}

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.shoppingList);
    setItems(stored ? JSON.parse(stored) : []);
    setIsLoaded(true);
  }, []);

  const saveItems = (newItems: ShoppingItem[]) => {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEYS.shoppingList, JSON.stringify(newItems));
  };

  const addItem = (name: string, category?: string) => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name,
      category,
      isDone: false,
      createdAt: Date.now(),
    };
    saveItems([...items, newItem]);
    return newItem;
  };

  const toggleItem = (id: string) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, isDone: !item.isDone } : item
    );
    saveItems(updated);
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter(item => item.id !== id));
  };

  const clearDoneItems = () => {
    saveItems(items.filter(item => !item.isDone));
  };

  const addFromMissing = (item: MissingItem) => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: item.name,
      category: item.category,
      isDone: false,
      createdAt: Date.now(),
    };
    saveItems([...items, newItem]);
  };

  return { items, isLoaded, addItem, toggleItem, deleteItem, clearDoneItems, addFromMissing };
}

export function useBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.bills);
    setBills(stored ? JSON.parse(stored) : []);
    setIsLoaded(true);
  }, []);

  const saveBills = (newBills: Bill[]) => {
    setBills(newBills);
    localStorage.setItem(STORAGE_KEYS.bills, JSON.stringify(newBills));
  };

  const addBill = (name: string, amount: number, dueDate: string, isRecurring: boolean = false) => {
    const newBill: Bill = {
      id: Date.now().toString(),
      name,
      amount,
      dueDate,
      isPaid: false,
      isRecurring,
      createdAt: Date.now(),
    };
    saveBills([...bills, newBill]);
    return newBill;
  };

  const toggleBillStatus = (id: string) => {
    const updated = bills.map(bill =>
      bill.id === id ? { 
        ...bill, 
        isPaid: !bill.isPaid,
        paidDate: !bill.isPaid ? new Date().toISOString().split('T')[0] : undefined
      } : bill
    );
    saveBills(updated);
  };

  const deleteBill = (id: string) => {
    saveBills(bills.filter(bill => bill.id !== id));
  };

  const getBillsSorted = () => {
    return [...bills].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const isOverdue = (bill: Bill) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(bill.dueDate);
    return dueDate < today && !bill.isPaid;
  };

  return { bills, isLoaded, addBill, toggleBillStatus, deleteBill, getBillsSorted, isOverdue };
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.expenses);
    setExpenses(stored ? JSON.parse(stored) : []);
    setIsLoaded(true);
  }, []);

  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(newExpenses));
  };

  const addExpense = (description: string, amount: number, category: string, date: string) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount,
      category,
      date,
      createdAt: Date.now(),
    };
    saveExpenses([...expenses, newExpense]);
    return newExpense;
  };

  const deleteExpense = (id: string) => {
    saveExpenses(expenses.filter(expense => expense.id !== id));
  };

  return { expenses, isLoaded, addExpense, deleteExpense };
}
