import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Wallet, SavingsPlan, User, SavingsFrequency, Transaction } from '@/types';
import { mockUser, mockProducts, mockWallet, mockSavingsPlans } from '@/lib/mockData';
import { toast } from '@/components/ui/use-toast';

// Helper function to generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

interface AppContextType {
  user: User | null;
  products: Product[];
  wallet: Wallet;
  savingsPlans: SavingsPlan[];
  isAuthenticated: boolean;
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'dateAdded' | 'priceHistory'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  // Wallet actions
  addFunds: (amount: number, description: string, productId: string) => Promise<void>;
  allocateFunds: (amount: number, productId: string) => void;
  // Savings plan actions
  createSavingsPlan: (productId: string, frequency: SavingsFrequency, months: number) => void;
  updateSavingsPlan: (plan: SavingsPlan) => void;
}

// Create context with a default undefined value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser); // For development, start as logged in
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [wallet, setWallet] = useState<Wallet>(mockWallet);
  const [savingsPlans, setSavingsPlans] = useState<SavingsPlan[]>(mockSavingsPlans);

  // Auth functions (mock implementation for now)
  const login = async (email: string, password: string) => {
    // In a real app, this would call an API or Firebase
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const signUp = async (email: string, password: string, name: string) => {
    // In a real app, this would call an API or Firebase
    setUser({
      id: generateId(),
      email,
      name,
    });
  };

  // Product management functions
  const addProduct = (productData: Omit<Product, 'id' | 'dateAdded' | 'priceHistory'>) => {
    const newProduct: Product = {
      id: generateId(),
      ...productData,
      dateAdded: new Date(),
      priceHistory: [{ date: new Date(), price: productData.price }]
    };
    
    setProducts([...products, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    const productIndex = products.findIndex(p => p.id === updatedProduct.id);
    
    if (productIndex !== -1) {
      // Check if price has changed
      const currentPrice = products[productIndex].price;
      let updatedPriceHistory = [...updatedProduct.priceHistory];
      
      if (updatedProduct.price !== currentPrice) {
        // Add new price point if price changed
        updatedPriceHistory.push({
          date: new Date(),
          price: updatedProduct.price
        });
      }
      
      const newProducts = [...products];
      newProducts[productIndex] = {
        ...updatedProduct,
        priceHistory: updatedPriceHistory
      };
      
      setProducts(newProducts);
    }
  };

  const deleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    
    // Also delete any associated savings plan
    setSavingsPlans(savingsPlans.filter(p => p.productId !== productId));
    
    // Return allocated funds to general balance
    const productTransactions = wallet.transactions.filter(
      t => t.type === 'allocation' && t.productId === productId
    );
    
    const totalAllocated = productTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    if (totalAllocated > 0) {
      const newTransaction: Transaction = {
        id: generateId(),
        amount: totalAllocated,
        date: new Date(),
        description: `Returned funds from deleted product`,
        type: 'deposit'
      };
      
      setWallet({
        ...wallet,
        transactions: [...wallet.transactions.filter(
          t => !(t.type === 'allocation' && t.productId === productId)
        ), newTransaction]
      });
    }
  };

  // Wallet management functions - UPDATED LOGIC
  const addFunds = async (amount: number, description: string, productId: string) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }

      // Create a deposit transaction (money added directly to product via UPI/banking)
      const depositTransaction: Transaction = {
        id: generateId(),
        amount,
        date: new Date(),
        description,
        type: 'deposit',
        productId
      };
      
      // Add funds to wallet through the product
      setWallet(prevWallet => ({
        ...prevWallet,
        balance: prevWallet.balance + amount,
        transactions: [...prevWallet.transactions, depositTransaction]
      }));

      // Update savings plan allocated amount
      const planIndex = savingsPlans.findIndex(p => p.productId === productId);
      if (planIndex !== -1) {
        const updatedPlans = [...savingsPlans];
        updatedPlans[planIndex] = {
          ...updatedPlans[planIndex],
          allocated: updatedPlans[planIndex].allocated + amount
        };
        setSavingsPlans(updatedPlans);
      }

      toast({
        title: 'Funds added',
        description: `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)} has been added to ${product.name}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error adding funds',
        description: error.message || 'An error occurred while adding funds.',
        variant: 'destructive',
      });
    }
  };

  // This function is kept for backwards compatibility but now it simply adds funds
  const allocateFunds = (amount: number, productId: string) => {
    // Simply forward to addFunds with a default description
    addFunds(amount, "Manual allocation", productId);
  };

  // Savings plan functions
  const createSavingsPlan = (productId: string, frequency: SavingsFrequency, months: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Calculate target date
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + months);
    
    // Calculate contribution amount based on frequency
    let contributionAmount;
    switch (frequency) {
      case SavingsFrequency.DAILY:
        contributionAmount = product.price / (months * 30); // Approximate
        break;
      case SavingsFrequency.WEEKLY:
        contributionAmount = product.price / (months * 4.33); // Approximate
        break;
      case SavingsFrequency.MONTHLY:
      default:
        contributionAmount = product.price / months;
        break;
    }
    
    // Get current allocated amount
    const allocatedTransactions = wallet.transactions.filter(
      t => t.type === 'allocation' && t.productId === productId
    );
    const currentAllocated = allocatedTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const newPlan: SavingsPlan = {
      productId,
      frequency,
      contributionAmount,
      targetDate,
      allocated: currentAllocated
    };
    
    // Check if plan already exists
    const existingPlanIndex = savingsPlans.findIndex(p => p.productId === productId);
    if (existingPlanIndex !== -1) {
      // Update existing plan
      const updatedPlans = [...savingsPlans];
      updatedPlans[existingPlanIndex] = newPlan;
      setSavingsPlans(updatedPlans);
    } else {
      // Add new plan
      setSavingsPlans([...savingsPlans, newPlan]);
    }
  };

  const updateSavingsPlan = (updatedPlan: SavingsPlan) => {
    const planIndex = savingsPlans.findIndex(p => p.productId === updatedPlan.productId);
    
    if (planIndex !== -1) {
      const newPlans = [...savingsPlans];
      newPlans[planIndex] = updatedPlan;
      setSavingsPlans(newPlans);
    }
  };

  const value = {
    user,
    products,
    wallet,
    savingsPlans,
    isAuthenticated: !!user,
    login,
    logout,
    signUp,
    addProduct,
    updateProduct,
    deleteProduct,
    addFunds,
    allocateFunds,
    createSavingsPlan,
    updateSavingsPlan
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the app context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
