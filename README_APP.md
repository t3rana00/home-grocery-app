# 🏠 Home Grocery App

A modern React + TypeScript + Vite application for managing home grocery shopping, missing items, and bills to pay. Mobile-first responsive design with local storage persistence.

## Features

### 📋 Missing at Home
- Track items noticed missing at home
- Add items with optional category and notes
- Move items directly to shopping list
- Delete items
- Empty state message

### 🛒 Shopping List
- Checklist for items to buy at the store
- Items can come from "Missing at Home" or added directly
- Check/uncheck items as you shop
- Clear all checked items with one click
- Delete individual items
- Progress tracking

### 💳 Bills to Pay
- Track recurring and one-time bills
- Add bills with name, amount, and due date
- Mark bills as paid/unpaid
- Automatic overdue highlighting (red background)
- Sort by due date
- Delete bills
- Currency formatting

### 📱 User Experience
- Mobile-first responsive design (optimized for phones)
- Soft colors with green accent (#2c5f2d)
- Clear empty states for each view
- Tab-based navigation (top/sticky)
- Persistent storage using localStorage
- Light, clean interface

## Project Structure

```
src/
├── components/
│   ├── NavBar.tsx          # Tab navigation component
│   ├── NavBar.css          # Navigation styling
│   ├── MissingList.tsx     # Missing items list
│   ├── MissingList.css     # Missing items styling
│   ├── ShoppingList.tsx    # Shopping list component
│   ├── ShoppingList.css    # Shopping list styling
│   ├── Bills.tsx           # Bills component
│   └── Bills.css           # Bills styling
├── hooks/
│   └── useLocalStorage.ts  # Custom hooks for data management
├── types/
│   └── index.ts            # TypeScript interfaces and types
├── App.tsx                 # Main app component
├── App.css                 # App-wide styling
├── main.tsx                # React entry point
└── index.css               # Global styles
```

## Data Structures

### MissingItem
```typescript
interface MissingItem {
  id: string;
  name: string;
  category?: string;
  note?: string;
  createdAt: number;
}
```

### ShoppingItem
```typescript
interface ShoppingItem {
  id: string;
  name: string;
  category?: string;
  isDone: boolean;
  createdAt: number;
}
```

### Bill
```typescript
interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD format
  isPaid: boolean;
  createdAt: number;
}
```

## localStorage Keys

The app uses the following localStorage keys to persist data:
- `missingItems` - Array of missing items
- `shoppingList` - Array of shopping items
- `bills` - Array of bills

Data is automatically saved to localStorage whenever it changes and loaded on app startup.

## Custom Hooks

### useMissingItems()
Manages missing items state and localStorage persistence.

Methods:
- `addItem(name, category?, note?)` - Add a new missing item
- `deleteItem(id)` - Delete an item
- `moveToShopping(item)` - Remove from missing (used before moving to shopping)

### useShoppingList()
Manages shopping list state and localStorage persistence.

Methods:
- `addItem(name, category?)` - Add a new shopping item
- `toggleItem(id)` - Check/uncheck item
- `deleteItem(id)` - Delete item
- `clearDoneItems()` - Remove all checked items
- `addFromMissing(item)` - Add item from missing items

### useBills()
Manages bills state and localStorage persistence.

Methods:
- `addBill(name, amount, dueDate)` - Add a new bill
- `toggleBillStatus(id)` - Mark bill as paid/unpaid
- `deleteBill(id)` - Delete a bill
- `getBillsSorted()` - Get bills sorted by due date
- `isOverdue(bill)` - Check if bill is overdue (past due date and unpaid)

## Color Scheme

- **Primary**: #2c5f2d (soft green)
- **Primary Dark**: #1e4620 (darker green)
- **Primary Light**: #f0f8f1 (light green background)
- **Background**: #fafafa (light gray)
- **Cards**: #ffffff (white)
- **Text Primary**: #333333 (dark gray)
- **Text Secondary**: #666666 (medium gray)
- **Border**: #e0e0e0 (light border)
- **Success**: #4caf50 (green for paid bills)
- **Danger**: #d32f2f (red for overdue/delete)
- **Warning**: #e65100 (orange for actions)

## Getting Started

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser to see the app.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Technologies Used

- **React 19.2.0** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Fast build tool and dev server
- **CSS** - Styling (no external UI framework, custom CSS)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Internet Explorer is not supported

## Future Enhancements

- Export/import data as CSV or JSON
- Recurring bills automation
- Push notifications for overdue bills
- Dark mode toggle
- Budgeting and spending analytics
- Share lists with family members
- Cloud sync across devices

## License

MIT
