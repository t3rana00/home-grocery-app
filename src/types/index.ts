// Types for the home grocery app

export interface MissingItem {
  id: string;
  name: string;
  category?: string;
  note?: string;
  createdAt: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category?: string;
  isDone: boolean;
  createdAt: number;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD format
  isPaid: boolean;
  paidDate?: string; // Date when marked as paid
  isRecurring: boolean; // Monthly recurring bill
  createdAt: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category?: string;
  date: string; // YYYY-MM-DD format
  createdAt: number;
}

export type Tab = 'missing' | 'shopping' | 'bills' | 'expenses';
