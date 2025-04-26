import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/mockData';
import { PlusCircle, ArrowUpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Wallet: React.FC = () => {
  const { wallet, products, addFunds } = useApp();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleAddFunds = () => {
    try {
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error('Please enter a valid amount');
      }
      
      if (!description.trim()) {
        throw new Error('Please enter a description');
      }

      if (!selectedProductId) {
        throw new Error('Please select a product');
      }
      
      addFunds(amountValue, description, selectedProductId);
      setAmount('');
      setDescription('');
      setSelectedProductId('');
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error adding funds',
        description: error.message || 'An error occurred while adding funds.',
        variant: 'destructive',
      });
    }
  };
  
  const groupTransactionsByMonth = () => {
    const grouped: Record<string, typeof wallet.transactions> = {};
    
    wallet.transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      
      grouped[monthKey].push(transaction);
    });
    
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
    
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      
      if (yearA !== yearB) {
        return yearB - yearA;
      }
      
      return monthB - monthA;
    });
    
    return { grouped, sortedKeys };
  };
  
  const { grouped, sortedKeys } = groupTransactionsByMonth();
  
  const totalDeposits = wallet.transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalAllocations = wallet.transactions
    .filter(t => t.type === 'allocation')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Wallet</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Add Funds via UPI/Banking
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Funds to Product</DialogTitle>
              <DialogDescription>
                Select a product and enter the amount you want to save via UPI or internet banking.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product">Select Product</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - {formatCurrency(product.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Source (Payment Method)</Label>
                <Input
                  id="description"
                  placeholder="e.g., UPI, NetBanking, IMPS"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFunds}>Add Funds</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Balance</CardDescription>
            <CardTitle className="text-3xl text-primary">{formatCurrency(wallet.balance)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total funds saved across all products
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Deposits</CardDescription>
            <CardTitle className="text-2xl text-success">{formatCurrency(totalDeposits)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All funds added to your products
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Products with Savings</CardDescription>
            <CardTitle className="text-2xl">{products.filter(p => {
              const hasSavings = wallet.transactions.some(t => t.productId === p.id);
              return hasSavings;
            }).length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Products you're currently saving for
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {sortedKeys.length > 0 ? (
              sortedKeys.map(monthKey => {
                const transactions = grouped[monthKey];
                const monthName = new Date(transactions[0].date).toLocaleString('default', { month: 'long', year: 'numeric' });
                
                return (
                  <div key={monthKey} className="mb-6">
                    <h3 className="text-md font-medium mb-2">{monthName}</h3>
                    <Card>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {transactions.map(transaction => {
                            const product = transaction.productId 
                              ? products.find(p => p.id === transaction.productId)
                              : null;
                              
                            return (
                              <div key={transaction.id} className="flex items-center justify-between p-4">
                                <div>
                                  <div className="flex items-center">
                                    <PlusCircle className="h-4 w-4 mr-2 text-success" />
                                    <p className="font-medium">
                                      {transaction.description}
                                      {product && (
                                        <span className="text-muted-foreground ml-1">
                                          for {product.name}
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(transaction.date).toLocaleString()}
                                  </p>
                                </div>
                                <span className="font-semibold text-success">
                                  +{formatCurrency(transaction.amount)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No transactions yet</p>
                  <Button onClick={() => setIsDialogOpen(true)}>Add Your First Funds</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="deposits">
            {wallet.transactions.filter(t => t.type === 'deposit').length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {wallet.transactions
                      .filter(t => t.type === 'deposit')
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(transaction => {
                        const product = transaction.productId 
                          ? products.find(p => p.id === transaction.productId)
                          : null;
                          
                        return (
                          <div key={transaction.id} className="flex items-center justify-between p-4">
                            <div>
                              <div className="flex items-center">
                                <PlusCircle className="h-4 w-4 mr-2 text-success" />
                                <p className="font-medium">
                                  {transaction.description}
                                  {product && (
                                    <span className="text-muted-foreground ml-1">
                                      for {product.name}
                                    </span>
                                  )}
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(transaction.date).toLocaleString()}
                              </p>
                            </div>
                            <span className="font-semibold text-success">
                              +{formatCurrency(transaction.amount)}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No deposits yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Wallet;
