
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const { logout, wallet } = useApp();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-primary text-xl font-bold">PricePal</span>
            </Link>
          </div>

          <nav className="flex items-center space-x-4 md:space-x-6">
            <Link to="/dashboard" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/wishlist" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium">
              Wishlist
            </Link>
            <Link to="/wallet" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium">
              Wallet ({new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(wallet.balance)})
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-2"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <button
              onClick={logout}
              className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Log Out
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
