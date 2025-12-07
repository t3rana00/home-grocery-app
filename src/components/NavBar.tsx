import type { Tab } from '../types';
import './NavBar.css';

interface NavBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function NavBar({ activeTab, onTabChange }: NavBarProps) {
  return (
    <nav className="navbar">
      <button
        className={`nav-button ${activeTab === 'missing' ? 'active' : ''}`}
        onClick={() => onTabChange('missing')}
      >
        Missing at Home
      </button>
      <button
        className={`nav-button ${activeTab === 'shopping' ? 'active' : ''}`}
        onClick={() => onTabChange('shopping')}
      >
        Shopping List
      </button>
      <button
        className={`nav-button ${activeTab === 'bills' ? 'active' : ''}`}
        onClick={() => onTabChange('bills')}
      >
        Bills to Pay
      </button>
      <button
        className={`nav-button ${activeTab === 'expenses' ? 'active' : ''}`}
        onClick={() => onTabChange('expenses')}
      >
        Daily Expenses
      </button>
    </nav>
  );
}
