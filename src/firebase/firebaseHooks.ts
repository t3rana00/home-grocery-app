import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
} from 'firebase/firestore';
import { db } from './config';
import type { MissingItem, ShoppingItem, Bill, Expense } from '../types';
import type { Payer } from '../types';

// Hook for User Profile (name)
export function useUserProfile(userId: string | null) {
  const [userName, setUserName] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsLoaded(true);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data()?.name || '');
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setIsLoaded(true);
      }
    };

    fetchUserProfile();
  }, [userId]);

  return { userName, isLoaded };
}

// Hook for Missing Items
export function useFirebaseMissingItems(userId: string = 'guest') {
  const [items, setItems] = useState<MissingItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, `users/${userId}/missingItems`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MissingItem[];
      setItems(itemsData);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [userId]);

  const addItem = async (name: string, category?: string, note?: string) => {
    const newItem = {
      name,
      category: category || null,
      note: note || null,
      createdAt: Date.now(),
    };
    const docRef = await addDoc(collection(db, `users/${userId}/missingItems`), newItem);
    return { id: docRef.id, ...newItem } as MissingItem;
  };

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, `users/${userId}/missingItems`, id));
  };

  const moveToShopping = (item: MissingItem) => {
    deleteItem(item.id);
    return item;
  };

  return { items, isLoaded, addItem, deleteItem, moveToShopping };
}

// Hook for Shopping List
export function useFirebaseShoppingList(userId: string = 'guest') {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, `users/${userId}/shoppingList`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ShoppingItem[];
      setItems(itemsData);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [userId]);

  const addItem = async (name: string, category?: string) => {
    const newItem = {
      name,
      category: category || null,
      isDone: false,
      createdAt: Date.now(),
    };
    const docRef = await addDoc(collection(db, `users/${userId}/shoppingList`), newItem);
    return { id: docRef.id, ...newItem } as ShoppingItem;
  };

  const toggleItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      await updateDoc(doc(db, `users/${userId}/shoppingList`, id), {
        isDone: !item.isDone,
      });
    }
  };

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, `users/${userId}/shoppingList`, id));
  };

  const clearDoneItems = async () => {
    const doneItems = items.filter((item) => item.isDone);
    await Promise.all(doneItems.map((item) => deleteItem(item.id)));
  };

  const addFromMissing = async (item: MissingItem) => {
    const newItem = {
      name: item.name,
      category: item.category || null,
      isDone: false,
      createdAt: Date.now(),
    };
    const docRef = await addDoc(collection(db, `users/${userId}/shoppingList`), newItem);
    return { id: docRef.id, ...newItem } as ShoppingItem;
  };

  return { items, isLoaded, addItem, toggleItem, deleteItem, clearDoneItems, addFromMissing };
}

// Hook for Bills
export function useFirebaseBills(userId: string = 'guest') {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, `users/${userId}/bills`),
      orderBy('dueDate', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const billsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Bill[];
      setBills(billsData);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [userId]);

  const addBill = async (name: string, amount: number, dueDate: string, isRecurring: boolean = false) => {
    const newBill = {
      name,
      amount,
      dueDate,
      isPaid: false,
      isRecurring,
      createdAt: Date.now(),
    };
    const docRef = await addDoc(collection(db, `users/${userId}/bills`), newBill);
    return { id: docRef.id, ...newBill } as Bill;
  };

  const toggleBillStatus = async (id: string) => {
    const bill = bills.find((b) => b.id === id);
    if (bill) {
      const updateData: any = {
        isPaid: !bill.isPaid,
      };
      if (!bill.isPaid) {
        updateData.paidDate = new Date().toISOString().split('T')[0];
      } else {
        updateData.paidDate = null;
      }
      await updateDoc(doc(db, `users/${userId}/bills`, id), updateData);
    }
  };

  const deleteBill = async (id: string) => {
    await deleteDoc(doc(db, `users/${userId}/bills`, id));
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

// Hook for Expenses
export function useFirebaseExpenses(userId: string = 'guest') {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, `users/${userId}/expenses`),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expensesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Expense[];
      setExpenses(expensesData);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [userId]);

  const addExpense = async (
    description: string,
    amount: number,
    category: string,
    date: string,
    paidBy: string
  ) => {
    const newExpense = {
      description,
      amount,
      category: category || null,
      paidBy: paidBy || 'Unknown',
      date,
      createdAt: Date.now(),
    };
    const docRef = await addDoc(collection(db, `users/${userId}/expenses`), newExpense);
    return { id: docRef.id, ...newExpense } as Expense;
  };

  const deleteExpense = async (id: string) => {
    await deleteDoc(doc(db, `users/${userId}/expenses`, id));
  };

  return { expenses, isLoaded, addExpense, deleteExpense };
}

// Hook for Payers (people who can pay expenses)
export function useFirebasePayers(userId: string = 'guest') {
  const [payers, setPayers] = useState<Payer[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, `users/${userId}/payers`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Payer[];
      setPayers(data);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [userId]);

  const addPayer = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const existing = payers.find((p) => p.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing;
    const newPayer = { name: trimmed, createdAt: Date.now() };
    const docRef = await addDoc(collection(db, `users/${userId}/payers`), newPayer);
    return { id: docRef.id, ...newPayer } as Payer;
  };

  return { payers, isLoaded, addPayer };
}
