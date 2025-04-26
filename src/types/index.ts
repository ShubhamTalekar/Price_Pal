
// Product Types
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  productUrl?: string;
  dateAdded: Date;
  priceHistory: PricePoint[];
}

export interface PricePoint {
  date: Date;
  price: number;
}

// Wallet Types
export interface Wallet {
  balance: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  type: 'deposit' | 'allocation';
  productId?: string;
}

// Savings Plan Types
export enum SavingsFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export interface SavingsPlan {
  productId: string;
  frequency: SavingsFrequency;
  contributionAmount: number;
  targetDate: Date;
  allocated: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
}
