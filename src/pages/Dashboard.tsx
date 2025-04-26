
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { formatCurrency, calculateProgress, calculateRemainingDays } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { SavingsFrequency } from '@/types';
import { ChartLine } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { products, wallet, savingsPlans } = useApp();

  // Total wishlist value
  const totalWishlistValue = products.reduce((sum, product) => sum + product.price, 0);
  
  // Total allocated savings
  const totalAllocated = savingsPlans.reduce((sum, plan) => sum + plan.allocated, 0);
  
  // Get top products based on completion percentage
  const topProducts = [...products]
    .map(product => {
      const progress = calculateProgress(product.id);
      const plan = savingsPlans.find(p => p.productId === product.id);
      return { ...product, progress, plan };
    })
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);

  // Format frequency into user-friendly text
  const getFrequencyText = (frequency: SavingsFrequency): string => {
    switch (frequency) {
      case SavingsFrequency.DAILY:
        return 'Daily';
      case SavingsFrequency.WEEKLY:
        return 'Weekly';
      case SavingsFrequency.MONTHLY:
        return 'Monthly';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/wishlist/add">Add New Product</Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Wallet Balance</CardDescription>
            <CardTitle className="text-2xl text-primary">{formatCurrency(wallet.balance)}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/wallet" className="text-sm text-primary hover:underline">
              Manage Wallet →
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Wishlist</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalWishlistValue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {products.length} items in wishlist
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Saved</CardDescription>
            <CardTitle className="text-2xl text-success">{formatCurrency(totalAllocated)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {Math.round((totalAllocated / totalWishlistValue) * 100)}% of wishlist value
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Savings Progress</h2>
        
        {topProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topProducts.map(product => (
              <Card key={product.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{formatCurrency(product.price)}</CardDescription>
                    </div>
                    {product.progress === 100 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success text-white">
                        Ready to Buy
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Savings Progress</span>
                      <span className="font-medium">{product.progress}%</span>
                    </div>
                    <Progress value={product.progress} className="h-2" />
                  </div>
                  
                  {product.plan && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Saving</span>
                        <p>{formatCurrency(product.plan.contributionAmount)} {getFrequencyText(product.plan.frequency)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ready In</span>
                        <p>{calculateRemainingDays(product.plan.targetDate)} days</p>
                      </div>
                    </div>
                  )}
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/wishlist/${product.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <ChartLine className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No products yet</h3>
              <p className="text-muted-foreground text-center mt-2">
                Start adding products to your wishlist to track your savings progress.
              </p>
              <Button asChild className="mt-4">
                <Link to="/wishlist/add">Add Your First Product</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {wallet.transactions.slice(0, 5).map(transaction => {
                const productName = transaction.productId 
                  ? products.find(p => p.id === transaction.productId)?.name 
                  : null;
                
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`font-semibold ${transaction.type === 'deposit' ? 'text-success' : 'text-primary'}`}>
                      {transaction.type === 'deposit' ? '+' : ''}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                );
              })}
              
              {wallet.transactions.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  No transactions yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
