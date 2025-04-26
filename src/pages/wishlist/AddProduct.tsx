
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { SavingsFrequency } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { addProduct, createSavingsPlan } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [frequency, setFrequency] = useState<SavingsFrequency>(SavingsFrequency.MONTHLY);
  const [months, setMonths] = useState('12');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Price validation
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Please enter a valid price');
      }
      
      // Months validation
      const monthsValue = parseInt(months);
      if (isNaN(monthsValue) || monthsValue <= 0) {
        throw new Error('Please enter a valid savings period');
      }
      
      // Create the product
      const productData = {
        name,
        price: priceValue,
        imageUrl: imageUrl || undefined,
        productUrl: productUrl || undefined
      };
      
      addProduct(productData);
      
      // Get the new product ID (simulated in our mock implementation)
      const newProductId = name.toLowerCase().replace(/\s+/g, '-'); // This is just a placeholder way of guessing the ID
      
      // Create savings plan
      createSavingsPlan(newProductId, frequency, monthsValue);
      
      toast({
        title: 'Product added!',
        description: `${name} has been added to your wishlist.`,
      });
      
      navigate('/wishlist');
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error adding product',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate estimated savings based on current inputs
  const calculateEstimatedSavings = () => {
    const priceValue = parseFloat(price);
    const monthsValue = parseInt(months);
    
    if (isNaN(priceValue) || isNaN(monthsValue) || priceValue <= 0 || monthsValue <= 0) {
      return null;
    }
    
    let periodDivisor;
    switch (frequency) {
      case SavingsFrequency.DAILY:
        periodDivisor = monthsValue * 30; // Approximate days
        break;
      case SavingsFrequency.WEEKLY:
        periodDivisor = monthsValue * 4.33; // Approximate weeks
        break;
      case SavingsFrequency.MONTHLY:
      default:
        periodDivisor = monthsValue;
        break;
    }
    
    const estimatedAmount = priceValue / periodDivisor;
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(estimatedAmount);
  };
  
  const estimatedSavings = calculateEstimatedSavings();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/wishlist')}
        className="mb-6"
      >
        Back to Wishlist
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Product</CardTitle>
          <CardDescription>
            Add a product to your wishlist and create a savings plan
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                placeholder="Samsung S24"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                placeholder="55699"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productUrl">Product URL (optional)</Label>
              <Input
                id="productUrl"
                placeholder="https://amazon.in/product"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
              />
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Savings Plan</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="12"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                    required
                    min="1"
                  />
                </div>
              </div>
              
              {estimatedSavings && (
                <div className="mt-4 p-4 bg-secondary rounded-md">
                  <p className="text-sm font-medium">Estimated Savings:</p>
                  <p className="text-lg font-bold text-primary">
                    {estimatedSavings} per {frequency.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddProduct;
