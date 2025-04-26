
import { Product, PricePoint, Wallet, Transaction, SavingsFrequency, SavingsPlan, User } from '@/types';

// Mock User Data
export const mockUser: User = {
  id: 'user123',
  email: 'user@example.com',
  name: 'Demo User',
  photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
};

// Mock Product Data
export const mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Samsung S24',
    price: 55699,
    imageUrl: 'https://placehold.co/300x200?text=Samsung+S24',
    productUrl: 'https://www.amazon.in/Samsung-Galaxy-S24-Cobalt-Storage/dp/B0CRHJXLNS/',
    dateAdded: new Date('2023-12-15'),
    priceHistory: [
      { date: new Date('2023-12-15'), price: 57899 },
      { date: new Date('2024-01-15'), price: 56799 },
      { date: new Date('2024-02-15'), price: 55699 }
    ]
  },
  {
    id: 'prod2',
    name: 'MacBook Air M2',
    price: 89990,
    imageUrl: 'https://placehold.co/300x200?text=MacBook+Air+M2',
    productUrl: 'https://www.amazon.in/Apple-MacBook-13-inch-8%E2%80%91core-storage/dp/B0CB5LD4TP/',
    dateAdded: new Date('2024-01-10'),
    priceHistory: [
      { date: new Date('2024-01-10'), price: 94990 },
      { date: new Date('2024-02-10'), price: 92990 },
      { date: new Date('2024-03-10'), price: 89990 }
    ]
  },
  {
    id: 'prod3',
    name: 'Sony WH-1000XM5',
    price: 24990,
    imageUrl: 'https://placehold.co/300x200?text=Sony+WH-1000XM5',
    productUrl: 'https://www.amazon.in/Sony-WH-1000XM5-Cancelling-Wireless-Headphones/dp/B09XS7JWHH/',
    dateAdded: new Date('2024-02-05'),
    priceHistory: [
      { date: new Date('2024-02-05'), price: 26990 },
      { date: new Date('2024-03-05'), price: 24990 }
    ]
  }
];

// Mock Wallet Data
export const mockWallet: Wallet = {
  balance: 35000,
  transactions: [
    {
      id: 'trans1',
      amount: 10000,
      date: new Date('2024-01-01'),
      description: 'Initial deposit',
      type: 'deposit'
    },
    {
      id: 'trans2',
      amount: 15000,
      date: new Date('2024-02-01'),
      description: 'Monthly savings',
      type: 'deposit'
    },
    {
      id: 'trans3',
      amount: 10000,
      date: new Date('2024-03-01'),
      description: 'Bonus savings',
      type: 'deposit'
    },
    {
      id: 'trans4',
      amount: 8000,
      date: new Date('2024-03-15'),
      description: 'Allocated to Samsung S24',
      type: 'allocation',
      productId: 'prod1'
    },
    {
      id: 'trans5',
      amount: 5000,
      date: new Date('2024-03-20'),
      description: 'Allocated to Sony WH-1000XM5',
      type: 'allocation',
      productId: 'prod3'
    }
  ]
};

// Mock Savings Plans
export const mockSavingsPlans: SavingsPlan[] = [
  {
    productId: 'prod1',
    frequency: SavingsFrequency.MONTHLY,
    contributionAmount: 5000,
    targetDate: new Date('2024-10-15'),
    allocated: 8000
  },
  {
    productId: 'prod2',
    frequency: SavingsFrequency.WEEKLY,
    contributionAmount: 1500,
    targetDate: new Date('2025-02-10'),
    allocated: 0
  },
  {
    productId: 'prod3',
    frequency: SavingsFrequency.MONTHLY,
    contributionAmount: 2500,
    targetDate: new Date('2024-08-05'),
    allocated: 5000
  }
];

// Helper function to calculate savings progress
export const calculateProgress = (productId: string): number => {
  const product = mockProducts.find(p => p.id === productId);
  const plan = mockSavingsPlans.find(p => p.productId === productId);
  
  if (!product || !plan) return 0;
  
  return Math.min(100, Math.round((plan.allocated / product.price) * 100));
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper function to calculate remaining days
export const calculateRemainingDays = (targetDate: Date): number => {
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
