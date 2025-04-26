
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/mockData';
import { ShoppingCart, Trash2, PencilLine, ExternalLink } from 'lucide-react';
import PriceHistoryChart from '@/components/PriceHistoryChart';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SavingsFrequency } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products, savingsPlans, wallet, updateProduct, deleteProduct, allocateFunds, updateSavingsPlan } = useApp();
  
  const product = products.find(p => p.id === productId);
  const savingsPlan = savingsPlans.find(p => p.productId === productId);
  
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [productUrl, setProductUrl] = useState(product?.productUrl || '');
  
  const [editPlanMode, setEditPlanMode] = useState(false);
  const [frequency, setFrequency] = useState<SavingsFrequency>(savingsPlan?.frequency || SavingsFrequency.MONTHLY);
  const [months, setMonths] = useState('12');
  
  const [allocationAmount, setAllocationAmount] = useState('');
  
  if (!product || !productId) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => navigate('/wishlist')}>Back to Wishlist</Button>
      </div>
    );
  }
  
  // Calculate progress
  const totalAllocated = savingsPlan?.allocated || 0;
  const progress = Math.min(100, Math.round((totalAllocated / product.price) * 100));
  
  // Calculate remaining amount
  const remaining = Math.max(0, product.price - totalAllocated);
  
  // Handle product updates
  const handleUpdateProduct = () => {
    try {
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Please enter a valid price');
      }
      
      updateProduct({
        ...product,
        name,
        price: priceValue,
        imageUrl: imageUrl || undefined,
        productUrl: productUrl || undefined
      });
      
      setEditMode(false);
      toast({
        title: 'Product updated',
        description: 'Your product details have been updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating product',
        description: error.message || 'An error occurred while updating the product.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle savings plan updates
  const handleUpdateSavingsPlan = () => {
    try {
      const monthsValue = parseInt(months);
      if (isNaN(monthsValue) || monthsValue <= 0) {
        throw new Error('Please enter a valid number of months');
      }
      
      // Calculate target date
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + monthsValue);
      
      // Calculate contribution amount based on frequency and remaining price
      let contributionAmount;
      switch (frequency) {
        case SavingsFrequency.DAILY:
          contributionAmount = remaining / (monthsValue * 30); // Approximate
          break;
        case SavingsFrequency.WEEKLY:
          contributionAmount = remaining / (monthsValue * 4.33); // Approximate
          break;
        case SavingsFrequency.MONTHLY:
        default:
          contributionAmount = remaining / monthsValue;
          break;
      }
      
      if (savingsPlan) {
        updateSavingsPlan({
          ...savingsPlan,
          frequency,
          contributionAmount,
          targetDate
        });
      }
      
      setEditPlanMode(false);
      toast({
        title: 'Savings plan updated',
        description: 'Your savings plan has been updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating savings plan',
        description: error.message || 'An error occurred while updating the savings plan.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle fund allocation
  const handleAllocateFunds = () => {
    try {
      const amount = parseFloat(allocationAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }
      
      if (amount > wallet.balance) {
        throw new Error('Insufficient wallet balance');
      }
      
      allocateFunds(amount, productId);
      setAllocationAmount('');
      
      toast({
        title: 'Funds allocated',
        description: `${formatCurrency(amount)} has been allocated to ${product.name}.`,
      });
      
      // If product is fully funded, show success message
      if (totalAllocated + amount >= product.price) {
        toast({
          title: 'Congratulations!',
          description: `You've saved enough to buy ${product.name}!`,
          variant: 'default',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error allocating funds',
        description: error.message || 'An error occurred while allocating funds.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle product deletion
  const handleDeleteProduct = () => {
    deleteProduct(productId);
    toast({
      title: 'Product deleted',
      description: 'The product has been removed from your wishlist.',
    });
    navigate('/wishlist');
  };
  
  // Format the frequency text
  const getFrequencyText = (freq: SavingsFrequency): string => {
    switch (freq) {
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
    <div className="max-w-3xl mx-auto py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/wishlist')}
        className="mb-6"
      >
        Back to Wishlist
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  {editMode ? (
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-2xl font-bold mb-2"
                    />
                  ) : (
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                  )}
                  
                  {editMode ? (
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  ) : (
                    <CardDescription className="text-lg">
                      {formatCurrency(product.price)}
                    </CardDescription>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {editMode ? (
                    <>
                      <Button size="sm" onClick={handleUpdateProduct}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
                        <PencilLine className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {product.name}? This action cannot be undone.
                              Any allocated funds will be returned to your wallet.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteProduct}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {editMode ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productUrl">Product URL</Label>
                    <Input
                      id="productUrl"
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      placeholder="https://amazon.in/product"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="aspect-video rounded-md bg-gray-100 overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-secondary">
                        <span className="text-muted-foreground">No image available</span>
                      </div>
                    )}
                  </div>
                  
                  {product.productUrl && (
                    <div>
                      <a
                        href={product.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View product online
                      </a>
                    </div>
                  )}
                </>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Savings Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                
                <div className="flex justify-between text-sm mt-2">
                  <span>Saved: {formatCurrency(totalAllocated)}</span>
                  <span>Remaining: {formatCurrency(remaining)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <PriceHistoryChart priceHistory={product.priceHistory} />
              </div>
            </CardContent>
            
            {progress >= 100 && (
              <CardFooter>
                <Button className="w-full" asChild>
                  <a 
                    href={product.productUrl || '#'} 
                    target={product.productUrl ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </a>
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Savings Plan */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Savings Plan</CardTitle>
                {!editPlanMode && savingsPlan && (
                  <Button size="sm" variant="outline" onClick={() => setEditPlanMode(true)}>
                    <PencilLine className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editPlanMode ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Saving Frequency</Label>
                    <Select
                      value={frequency}
                      onValueChange={(value) => setFrequency(value as SavingsFrequency)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SavingsFrequency.DAILY}>Daily</SelectItem>
                        <SelectItem value={SavingsFrequency.WEEKLY}>Weekly</SelectItem>
                        <SelectItem value={SavingsFrequency.MONTHLY}>Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="months">Time Period (Months)</Label>
                    <Input
                      id="months"
                      type="number"
                      value={months}
                      onChange={(e) => setMonths(e.target.value)}
                      min="1"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={handleUpdateSavingsPlan} className="flex-1">Save</Button>
                    <Button variant="outline" onClick={() => setEditPlanMode(false)}>Cancel</Button>
                  </div>
                </div>
              ) : savingsPlan ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-secondary p-3 rounded-md">
                      <span className="text-xs text-muted-foreground block">Saving</span>
                      <span className="font-medium">
                        {formatCurrency(savingsPlan.contributionAmount)}
                      </span>
                      <span className="text-xs text-muted-foreground block">
                        {getFrequencyText(savingsPlan.frequency)}
                      </span>
                    </div>
                    
                    <div className="bg-secondary p-3 rounded-md">
                      <span className="text-xs text-muted-foreground block">Target Date</span>
                      <span className="font-medium">
                        {new Date(savingsPlan.targetDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Keep adding funds to your savings to reach your goal!
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-3">No savings plan yet</p>
                  <Button onClick={() => setEditPlanMode(true)}>Create Plan</Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Allocate Funds */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Allocate Funds</CardTitle>
              <CardDescription>
                Wallet Balance: {formatCurrency(wallet.balance)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={allocationAmount}
                  onChange={(e) => setAllocationAmount(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleAllocateFunds} 
                className="w-full"
                disabled={!allocationAmount || parseFloat(allocationAmount) <= 0 || parseFloat(allocationAmount) > wallet.balance}
              >
                Add Funds
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
